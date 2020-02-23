import {
  APIGatewayProxyHandler
} from 'aws-lambda';
import 'source-map-support/register';
import * as Knex from 'knex';
import {
  Model,
  knexSnakeCaseMappers
} from 'objection';

import * as convertXmlToJSON from 'xml2js'
import axios from 'axios';

//Helpers
import {
  validateEmail,
  validatePhoneNumber,
  validateDLSubmission
} from './validators';
import {
  Subscription
} from './models/subscription'
import
DriverLicense
from './models/driverLicense';

import {
  sendEnrollmentConfirmation
} from './lib/functions/twilio';


// TYPES
import {
  SubscriptionRequest
} from './subscription';
import {
  DriverLicenseReport
} from './models/driverLicenseReport';

const knexConfig = require('./knexfile');


const knex = Knex({
  ...knexConfig,
  ...knexSnakeCaseMappers()
});

Model.knex(knex);


export const migrate: APIGatewayProxyHandler = async (event, _context) => {
  console.dir('here');
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
    const lastDlReport = await DriverLicenseReport.query().where('driverLicenseId', sub.driverLicenseId).orderBy('createdOn', 'desc').where('createdOn', '>=', thirtyDaysAgo).first();
    if (!lastDlReport) {
      dlIdsThatNeedReport.push(sub.driverLicenseId);
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
      const dlRequestUrl = baseURL.concat(apiMap.dlNumberSearch).replace('{DL}', dl.driverLicenseNumber).concat(miamiDadeApiAuthKey);
      const dlRecord = await DriverLicense.query()
        .where('driverLicenseNumber', dl.driverLicenseNumber).first();

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
        driverLicenseId: dlRecord.id,
        report: response,
        reportJsonb: jsonResponse,
        county: 'MIAMI-DADE'
      })

    } catch (error) {
      // alert on these errors
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

export const subscription: APIGatewayProxyHandler = async (event, _context) => {
  const subscriptionRequest: SubscriptionRequest = JSON.parse(event.body);
  const {
    emailAddressClient,
    phoneNumberClient,
    driverLicenseIdClient,
    countyClient
  } = subscriptionRequest;
  if (typeof emailAddressClient !== 'string' || typeof driverLicenseIdClient !== "string" || typeof countyClient !== "string") {
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
    console.dir(`starting validation`);
    const emailAddress = validateEmail(emailAddressClient);
    const phoneNumber =  validatePhoneNumber(phoneNumberClient);
    
    const {
      county,
      driverLicenseNumber
    } = validateDLSubmission(driverLicenseIdClient, countyClient);
    console.dir(`client validation ended`);
    // TODO upsert  (adjust for concurrency). INSPO https://gist.github.com/derhuerst/7b97221e9bc4e278d33576156e28e12d
    // TODO sanitaize return values from DB with try catch
    const existingDriverLicense = await DriverLicense.query().where('driverLicenseNumber', driverLicenseNumber).first()

    if (existingDriverLicense) {
      const existingSubscription = phoneNumber === false ? 
      await Subscription.query().where({
        emailAddress,
        driverLicenseId: existingDriverLicense.id
      }).first() : 
      await Subscription.query().where({
        emailAddress,
        phoneNumber,
        driverLicenseId: existingDriverLicense.id
      }).first()

      if (existingDriverLicense.disabled || existingSubscription) {
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
        driverLicenseId: existingDriverLicense.id,
        subscribedOn: new Date()
      });

      console.dir(`enrolled sending sms`);
      await sendEnrollmentConfirmation(phoneNumberClient, driverLicenseIdClient);

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
    const newDriverLicense = await DriverLicense.query().insert({
      driverLicenseNumber,
      county,
      disabled: false
    });
    // TODO validate DL here or exit?
    await Subscription.query().insert({
      emailAddress,
      phoneNumber,
      driverLicenseId: newDriverLicense.id,
      subscribedOn: new Date()
    });

    await sendEnrollmentConfirmation(emailAddress ,phoneNumberClient, driverLicenseIdClient);

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