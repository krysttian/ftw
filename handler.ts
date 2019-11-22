import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as Knex from 'knex';
import {Model, knexSnakeCaseMappers} from 'objection';
import * as twilio from 'twilio';

// import {isValidOrReturnDescription} from 'usdl-regex';
import * as convertXmlToJSON from 'xml2js'
const axios = require('axios');

const knexConfig = require('./knexfile');

export const knex = Knex({...knexConfig, ...knexSnakeCaseMappers()});

Model.knex(knex);

//Helpers
import {validateEmail, validatePhoneNumber} from './validators';
import {formatDLReportMiamiDade} from './helpers';
import {LaunchSubscriber, Counties} from './models/launchSubscriber';
import {Subscription} from './models/subscription'
import {DriversLicense} from './models/driversLicense';
import {DriversLicenseReport} from './models/driversLicenseReport'
import {Notification} from './models/notification'
import {MiamiDadeDLReportCaseResponse} from './dlReport'


export const migrate: APIGatewayProxyHandler = async (event, _context) => {
  await knex.migrate.latest(knexConfig);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };
}


export const launchSubscribe: APIGatewayProxyHandler = async (event, _context) => {
  const {emailAddressClient, countyClient} = JSON.parse(event.body);
  if (typeof emailAddressClient === 'undefined'|| typeof countyClient === 'undefined' || typeof Counties[countyClient] !== "string" ) {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 400,
      // move to http error handling
      body: 'BAD REQUEST, either email address is missing, or county submitted is not from allowed list'
    }
  }
  try {
    const emailAddress = validateEmail(emailAddressClient)
    const subscriber = await LaunchSubscriber.query().insert({emailAddress, county : countyClient})

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      subscriber
    }),
  };
} catch (error) {
  console.error(error);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 422,
      body: JSON.stringify({
          description: error.message
      }),
    };
  }
};

/**
 * @constructor
 * @param {string} dlNumber - Florida driverLicense
 * @returns {string} - success or error
 */
export const DLRMiamiDade: APIGatewayProxyHandler = async (event, _context) => {
  // THIS SHOULD BE A PRIVATE METHOD
  // ONLY INVOKABLE INTERNALY

  const baseURL = 'https://www2.miami-dadeclerk.com/Developers/';
  const miamiDadeApiAuthKey = process.env['MIAMI_DADE_COUNTY_AUTH_KEY'] || 'NOKEY';
  const apiMap = {
    dlNumberSearch: 'api/TrafficWeb?DL={DL}&AuthKey='
  }

  const {driversLicenseNumberClient} = JSON.parse(event.body);

  if (typeof driversLicenseNumberClient === 'undefined') {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 400,
      // move to http error handling
      body: 'BAD REQUEST'
    }
  }
  try {
    //  build url
    const dlRequestUrl = baseURL.concat(apiMap.dlNumberSearch).replace('{DL}', driversLicenseNumberClient).concat(miamiDadeApiAuthKey);
    const dlRecord = await DriversLicense.query()
    .where('drivers_license_number', driversLicenseNumberClient).first();

    // make request, XML only has information
    const request = await axios.get(dlRequestUrl, {
      headers: {
        'Accept': 'application/xml',

      }
    });
    const response = request.data;
    const jsonResponse = await convertXmlToJSON.parseStringPromise(response)
    await DriversLicenseReport.query().insert({
      driversLicenseId: dlRecord.id,
      report: response,
      reportJsonb: jsonResponse,
      county: 'MIAMI-DADE'
    })

    const caseList = jsonResponse.TrafficCasesResponse["CasesList"][0]["Cases"][0]["Case"];

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      caseList
    }),
  };
} catch (error) {
  console.error(error);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 422,
      body: JSON.stringify({
          description: error.message
      }),
    };
  }
};

export const subscription: APIGatewayProxyHandler = async (event, _context) => {
  const {emailAddressClient, phoneNumberClient, driversLicenseId} = JSON.parse(event.body);
// 
  if (typeof emailAddressClient === 'undefined'|| typeof phoneNumberClient !== "string" || typeof driversLicenseId !== "string" ) {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 400,
      // move to http error handling
      body: 'BAD REQUEST'
    };
  }
    try {
      const emailAddress = validateEmail(emailAddressClient)
      const phoneNumber = validatePhoneNumber(phoneNumberClient);
    const driversLicense = await DriversLicense.query().where('id', driversLicenseId).first();
    console.dir(driversLicense);
    // TODO we might be able to skip this check if we can make sure this is invoked by us only.
    if(typeof driversLicense === 'undefined') {
      throw new Error('Drives License does not exist');
    }
    const subscription = await Subscription.query().insert({emailAddress, phoneNumber, driversLicenseId: driversLicense.id})

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      subscription
    }),
  };
} catch (error) {
  console.error(error);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 422,
      body: JSON.stringify({
          description: error.message
      }),
    };
  }
};

// private event only
export const notifyAllUsers: APIGatewayProxyHandler = async (_, _context) => {

  /*
  what I want in plain words is for each subscription, send a notification if there isn't one for most recent report
  update the notification table when you do.
  select all still valid subscriptions JOIN on DL ID is DL ID in report MOST RECENT for that DLID WHERE SUBID AND REPORTID ARE NOT in NOTIFICATION
  */
    try {

      const validSubscriptions = await Subscription.query().where({
        unsubscribedOn: null
      });

      console.dir(validSubscriptions);
  
      const notifcationsToSend = [];
  
      for(const sub of validSubscriptions) {
        const {driversLicenseId} = sub
        // get latest report for that DL REPORT
        const dlReport = await DriversLicenseReport.query().where({driversLicenseId}).first();
  
        if (dlReport) {
          sub.dlReport = dlReport
          const notifcationAlreadyExists = await Notification.query().where({
              subscriptionId: sub.id,
              driversLicenseReportId: sub.dlReport.id
          }).first();
          if (!notifcationAlreadyExists) {
            notifcationsToSend.push(sub);
          }
        }
      }
  
      for (const notification of notifcationsToSend) {
        const cases = notification.dlReport.reportJsonb.TrafficCasesResponse["CasesList"][0]["Cases"][0]["Case"];
        console.dir(cases);
  
        const openIncidents = cases.filter(reportCase => reportCase["ActionDescription"][0] !==  "CLOSED");
        console.dir(openIncidents);
  
        const incidents: Array<MiamiDadeDLReportCaseResponse> = openIncidents.map(incident => {
          return {
            defendantName: incident.DefendantName,
            dob: incident.DoB,
            actionCode: incident.ActionCode,
            amountDue: incident.AmountDue,
          issueDate : incident.IssueDate,
          caseNumber: incident.CaseNumber,
          violationCode: incident.ViolationCode,
          actionDescription: incident.ActionDescription,
          violationDescription: incident.ViolationDescription,
          driverLicenseNum: incident.DriverLicenseNum
          };
        });

        console.dir(incidents);
        
          const messagetoTwilio = {
            phoneNumber: notification.phoneNumber,
          };
          const TWILIO_CLIENT_ID = process.env['TWILIO_CLIENT_ID'];
          const TWILIO_AUTH_KEY = process.env['TWILIO_AUTH_KEY'];
          const twilioClient = twilio(TWILIO_CLIENT_ID, TWILIO_AUTH_KEY);
          const message = formatDLReportMiamiDade(incidents);
          console.dir(message);
          return;
          if (incidents.length > 0) {
          twilioClient.messages.create({
            body: message,
            to: '+1' + messagetoTwilio.phoneNumber,  // Text this number
            from: '+17866289828' // From a valid Twilio number
          })
          .then(async (message) => await Notification.query().insert({
            subscriptionId: notification.id,
            driversLicenseReportId: notification.dlReport.id,
            sentOn: new Date,
            status: message.status
          }));
        } else {
          return
        }
      }  

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      test:'test'
    }),
  };
} catch (error) {
  console.error(error);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 422,
      body: JSON.stringify({
          description: error.message
      }),
    };
  }
};