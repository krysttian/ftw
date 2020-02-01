import {
  APIGatewayProxyHandler
} from 'aws-lambda';
import 'source-map-support/register';
import * as Knex from 'knex';
import {
  Model,
  knexSnakeCaseMappers
} from 'objection';

// // import {isValidOrReturnDescription} from 'usdl-regex';
import * as convertXmlToJSON from 'xml2js'
import axios from 'axios';

//Helpers
import {
  validateEmail,
  validatePhoneNumber,
  validateDLSubmission
} from './validators';
// import {
//   formatDLReportMiamiDade
// } from './helpers';
// import {
//   LaunchSubscriber,
//   Counties
// } from './models/launchSubscriber';
import {
  Subscription
} from './models/subscription'
import 
  DriverLicense
 from './models/driversLicense';
// import {
//   DriverLicenseReport
// } from './models/driversLicenseReport'
// import {
//   Notification
// } from './models/notification'

import {sendEnrollmentConfirmation} from './lib/functions/twilio';
// TYPES
import {
  SubscriptionRequest
} from './subscription';
import { DriverLicenseReport } from './models/driversLicenseReport';
// import {
//   MiamiDadeDLReportCaseResponse
// } from './dlReport'

 
const knexConfig = require('./knexfile');


const knex = Knex({
  ...knexConfig,
  ...knexSnakeCaseMappers()
});

Model.knex(knex);


export const migrate: APIGatewayProxyHandler = async (event, _context) => {
  console.dir('here');
  console.dir(knexConfig);
  await knex.migrate.latest(knexConfig);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Migration Ran',
      input: event,
    }, null, 2),
  };
}

/**
 * @param {string} dlNumber - Florida driverLicense For Miami Dade Selections
 * @returns {string} - success or error
 */ 
export const rundlReports: APIGatewayProxyHandler = async (_, _context) => {

  // log starting

  // log number of subs

  // log number of DL reports found vs making


  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));

  // get all valid Subscriptions with no notification in the last 30 days 
  // what if no notification but drivers report is last 30? 
  const dlIdsThatNeedReport = [];
  const validSubscriptions = await Subscription.query().where('unsubscribedOn', null);
  // extract just DL ids and transform to set for just unique values to reduce in unessecary addtional queries.
  for (const sub of validSubscriptions) {
    // most recent notification for that sub ID
    const lastDlReport = await DriverLicenseReport.query().where('driversLicenseId', sub.driversLicenseId).orderBy('createdOn', 'desc').where('createdOn', '>=', thirtyDaysAgo).first();
    if (!lastDlReport) {
      dlIdsThatNeedReport.push(sub.driversLicenseId);
    }
  }

  if (dlIdsThatNeedReport.length === 0) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: 'no subscriptions require report'
    };
  }

  console.dir(dlIdsThatNeedReport);
  
  const uniqueDlIds = [...new Set(dlIdsThatNeedReport)];

  const driverLicenses = await DriverLicense.query().whereIn('id', uniqueDlIds);

  const baseURL = 'https://www2.miami-dadeclerk.com/Developers/';
  const miamiDadeApiAuthKey = process.env['MIAMI_DADE_COUNTY_AUTH_KEY'] || 'NOKEY';
  const apiMap = {
    dlNumberSearch: 'api/TrafficWeb?DL={DL}&AuthKey='
  }

    for (const dl of driverLicenses) {
      try {

      //  build url
    const dlRequestUrl = baseURL.concat(apiMap.dlNumberSearch).replace('{DL}', dl.driversLicenseNumber).concat(miamiDadeApiAuthKey);
    const dlRecord = await DriverLicense.query()
      .where('driversLicenseNumber', dl.driversLicenseNumber).first();

    // make request, XML only has information
    const request = await axios.get(dlRequestUrl, {
      headers: {
        'Accept': 'application/xml',
      }
    });
    const response = request.data;
    const jsonResponse = await convertXmlToJSON.parseStringPromise(response);

    //<StatusDesc>NO CASE FOUND FOR A111-111-10-011-1 DRIVER LICENSE NOT DATABASE</StatusDesc> not sure if this is good enough to ommit all with a similar statusDesc

    console.dir(jsonResponse);
    await DriverLicenseReport.query().insert({
      driversLicenseId: dlRecord.id,
      report: response,
      reportJsonb: jsonResponse,
      county: 'MIAMI-DADE'
    })

  } catch (error) {
    // alert on these errors
    console.error(error);
    console.dir(dl);
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
}

return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  // include number and some subscription ids?
  body: 'Reports run',
};
}

// /**
//  * @param {string} dlNumber - Florida driverLicense For Miami Dade Selections
//  * @returns {string} - success or error
//  */ 
// export const DLRMiamiDade: APIGatewayProxyHandler = async (event, _context) => {
//   const baseURL = 'https://www2.miami-dadeclerk.com/Developers/';
//   const miamiDadeApiAuthKey = process.env['MIAMI_DADE_COUNTY_AUTH_KEY'] || 'NOKEY';
//   const apiMap = {
//     dlNumberSearch: 'api/TrafficWeb?DL={DL}&AuthKey='
//   }

//   const {
//     driversLicenseNumberClient
//   } = JSON.parse(event.body);

//   try {
//     //  build url
//     const dlRequestUrl = baseURL.concat(apiMap.dlNumberSearch).replace('{DL}', driversLicenseNumberClient).concat(miamiDadeApiAuthKey);
//     const dlRecord = await DriverLicense.query()
//       .where('drivers_license_number', driversLicenseNumberClient).first();

//     // make request, XML only has information
//     const request = await axios.get(dlRequestUrl, {
//       headers: {
//         'Accept': 'application/xml',

//       }
//     });
//     const response = request.data;
//     const jsonResponse = await convertXmlToJSON.parseStringPromise(response)
//     await DriverLicenseReport.query().insert({
//       driversLicenseId: dlRecord.id,
//       report: response,
//       reportJsonb: jsonResponse,
//       county: 'MIAMI-DADE'
//     })

//     const caseList = jsonResponse.TrafficCasesResponse["CasesList"][0]["Cases"][0]["Case"];

//     return {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': true,
//       },
//       body: JSON.stringify({
//         caseList
//       }),
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': true,
//       },
//       statusCode: 422,
//       body: JSON.stringify({
//         description: error.message
//       }),
//     };
//   }
// };

export const subscription: APIGatewayProxyHandler = async (event, _context) => {
  const subscriptionRequest: SubscriptionRequest = JSON.parse(event.body);
  const {
    emailAddressClient,
    phoneNumberClient,
    driversLicenseIdClient,
    dobClient,
    countyClient
  } = subscriptionRequest;
  if (typeof emailAddressClient !== 'string' || typeof phoneNumberClient !== "string" || typeof driversLicenseIdClient !== "string" || typeof dobClient !== "string" ||  typeof countyClient !== "string") {
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
    console.dir(`requestid ${_context.awsRequestId}, starting validation`);
    const emailAddress = validateEmail(emailAddressClient);
    const phoneNumber = validatePhoneNumber(phoneNumberClient);

    // if(smsMessage !== true) {
    //   throw new Error(`Unable to send SMS to ${phoneNumberClient}`);
    // }

    //send SMS
    const {county, dob, driversLicenseNumber} = validateDLSubmission(driversLicenseIdClient, dobClient, countyClient);
    console.dir(`requestid ${_context.awsRequestId}, client validation ended`);
    // TODO upsert  (adjust for concurrency). INSPO https://gist.github.com/derhuerst/7b97221e9bc4e278d33576156e28e12d
    // TODO sanitaize return values from DB with try catch
    const existingDriverLicense = await DriverLicense.query().where('driversLicenseNumber', driversLicenseNumber).first();
    console.dir(existingDriverLicense);
    console.dir(`requestid ${_context.awsRequestId}`);

    if (existingDriverLicense) {
      const existingSubscription = await Subscription.query().where({
        emailAddress,
        phoneNumber,
        driversLicenseId: existingDriverLicense.id
      }).first();

      console.dir(existingSubscription);

      if(existingDriverLicense.disabled || existingSubscription) {
        return {
          statusCode: 409,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({
          message: 'This is a duplicate Subscription in our system. Please reach out to support@drivefine.com if you belive this is an Error'
          }),
        };
      }

        await Subscription.query().insert({
          emailAddress,
          phoneNumber,
          driversLicenseId: existingDriverLicense.id,
          subscribedOn: new Date()
        });
  
        await sendEnrollmentConfirmation(phoneNumberClient, driversLicenseIdClient);
  
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({
          message: 'success'
          }),
        };
    }

    // DL isn't found, need to create before moving forward
    console.dir(`requestid ${_context.awsRequestId} dl not found`);
      const newDriverLicense = await DriverLicense.query().insert({
        dob,
        driversLicenseNumber,
        county,
        disabled: false
      });
      console.dir(`requestid ${_context.awsRequestId} ${newDriverLicense}`);
        // TODO validate DL here or exit?
        await Subscription.query().insert({
        emailAddress,
        phoneNumber,
        driversLicenseId: newDriverLicense.id,
        subscribedOn: new Date()
      });

      console.dir(`requestid ${_context.awsRequestId} subscription added`);

      await sendEnrollmentConfirmation(phoneNumberClient, driversLicenseIdClient);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
        message: 'success'
        }),
      };
    // user signed up, sending sms notification
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

// // private event only
// export const notifyAllUsers: APIGatewayProxyHandler = async (_, _context) => {

//   /*
//   what I want in plain words is for each subscription, send a notification if there isn't one for most recent report
//   update the notification table when you do.
//   select all still valid subscriptions JOIN on DL ID is DL ID in report MOST RECENT for that DLID WHERE SUBID AND REPORTID ARE NOT in NOTIFICATION
//   */
//   try {

//     const validSubscriptions = await Subscription.query().where({
//       unsubscribedOn: null
//     });

//     console.dir(validSubscriptions);

//     const notifcationsToSend = [];

//     for (const sub of validSubscriptions) {
//       const {
//         driversLicenseId
//       } = sub
//       // get latest report for that DL REPORT
//       const dlReport = await DriverLicenseReport.query().where({
//         driversLicenseId
//       }).first();

//       if (dlReport) {
//         sub.dlReport = dlReport
//         const notifcationAlreadyExists = await Notification.query().where({
//           subscriptionId: sub.id,
//           driversLicenseReportId: sub.dlReport.id
//         }).first();
//         if (!notifcationAlreadyExists) {
//           notifcationsToSend.push(sub);
//         }
//       }
//     }

//     for (const notification of notifcationsToSend) {
//       const cases = notification.dlReport.reportJsonb.TrafficCasesResponse["CasesList"][0]["Cases"][0]["Case"];
//       console.dir(cases);

//       const openIncidents = cases.filter(reportCase => reportCase["ActionDescription"][0] !== "CLOSED");
//       console.dir(openIncidents);

//       const incidents: Array < MiamiDadeDLReportCaseResponse > = openIncidents.map(incident => {
//         return {
//           defendantName: incident.DefendantName,
//           dob: incident.DoB,
//           actionCode: incident.ActionCode,
//           amountDue: incident.AmountDue,
//           issueDate: incident.IssueDate,
//           caseNumber: incident.CaseNumber,
//           violationCode: incident.ViolationCode,
//           actionDescription: incident.ActionDescription,
//           violationDescription: incident.ViolationDescription,
//           driverLicenseNum: incident.DriverLicenseNum
//         };
//       });

//       console.dir(incidents);

//       const messagetoTwilio = {
//         phoneNumber: notification.phoneNumber,
//       };
//       const TWILIO_CLIENT_ID = process.env['TWILIO_CLIENT_ID'];
//       const TWILIO_AUTH_KEY = process.env['TWILIO_AUTH_KEY'];
//       const twilioClient = twilio(TWILIO_CLIENT_ID, TWILIO_AUTH_KEY);
//       const message = formatDLReportMiamiDade(incidents);
//       console.dir(message);
//       return;
//       if (incidents.length > 0) {
//         twilioClient.messages.create({
//             body: message,
//             to: '+1' + messagetoTwilio.phoneNumber, // Text this number
//             from: '+17866289828' // From a valid Twilio number
//           })
//           .then(async (message) => await Notification.query().insert({
//             subscriptionId: notification.id,
//             driversLicenseReportId: notification.dlReport.id,
//             sentOn: new Date,
//             status: message.status
//           }));
//       } else {
//         return
//       }
//     }

//     return {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': true,
//       },
//       body: JSON.stringify({
//         test: 'test'
//       }),
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': true,
//       },
//       statusCode: 422,
//       body: JSON.stringify({
//         description: error.message
//       }),
//     };
//   }
// };