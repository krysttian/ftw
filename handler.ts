import {
  APIGatewayProxyHandler
} from 'aws-lambda';
import 'source-map-support/register';
import * as Knex from 'knex';
import * as moment from 'moment';
import {
  Model,
  knexSnakeCaseMappers
} from 'objection';

import {
  browardCountyCDLCheck
} from './lib/functions/browardCountyCheck';

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
  sendEnrollmentConfirmation,
  sendReportSMS,
  lookupPhoneNumber
} from './lib/functions/twilio';


// TYPES
import {
  SubscriptionRequest
} from './subscription';

import {
  Notification
} from './models/notification';

const knexConfig = require('./knexfile');


const knex = Knex({
  ...knexConfig,
  ...knexSnakeCaseMappers()
});

Model.knex(knex);


export const migrate: APIGatewayProxyHandler = async (event, _context) => {
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
  // TODO switch to momment
  
  const thirtyDaysAgo = moment().utc().subtract(1, 'months').format();

  // get all valid Subscriptions with no notification in the last 30 days 
  // what if no notification but drivers report is last 30?
    // what if no notification but drivers report is last 30? 
  const subscription = await Subscription.query()
    .alias('sub')
    .leftJoin('notifications AS notifications', 'notifications.subscriptionId', 'sub.id')
    .where(
      (qb)=> qb.where('notifications.createdOn', '<=', thirtyDaysAgo)
      .orWhere('notifications.createdOn', null))
    .first();
    // TODO consider some sort of group by driverlicense so we can run the report onces and easily sent it to relevant receipents so we don't rerun scrapes.

    if (typeof subscription !== 'undefined') {
      try {
        const driverLicense = await DriverLicense.query().where('id', subscription.driverLicenseId).first();
        const {
          reportInnerText
        } = await browardCountyCDLCheck(driverLicense.driverLicenseNumber);

        const message = await sendReportSMS(subscription.phoneNumber, driverLicense.driverLicenseNumber, reportInnerText, 'Broward County Clerk Of Courts');

        const messageResult = message[0];

        delete messageResult.body;

        // we need to make this much more bomb proof (make more columns optional) incase something happens.
        await Notification.query().insert({
          driverLicenseId: subscription.driverLicenseId,
          contactMethod: 'SMS',
          subscriptionId: subscription.id,
          notificationRequestResponse: messageResult,
          county: subscription.county,
          status: messageResult.status
        });

        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          // include number and some subscription ids?
          body: JSON.stringify({
            message: 'Notification sent'
          }, null, 2),
        };
      } catch (error) {
        // alert on these errors but don't halt thread cause we'll have to keep going
        console.error(`unable to process subId ${subscription.id}`);
        // lets update the notification table so we can be sure we don't spam anyways
        await Notification.query().insert({
          driverLicenseId: subscription.driverLicenseId,
          contactMethod: 'SMS',
          subscriptionId: subscription.id,
          notificationRequestResponse: null,
          county: subscription.county,
          status: 'failed'
        });
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
      body: JSON.stringify({
        message: 'No notifications to send'
      }, null, 2),
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
  if (typeof emailAddressClient !== 'string' || typeof driverLicenseIdClient !== "string" || typeof countyClient !== "string" || typeof phoneNumberClient !== "string") {
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
    const {
      phoneNumber
    } = await lookupPhoneNumber(phoneNumberClient);

    validatePhoneNumber(phoneNumber);

    const {
      county,
      driverLicenseNumber
    } = validateDLSubmission(driverLicenseIdClient, countyClient);
    console.dir(`client validation ended`);
    // TODO upsert  (adjust for concurrency). INSPO https://gist.github.com/derhuerst/7b97221e9bc4e278d33576156e28e12d
    // TODO sanitaize return values from DB with try catch
    let driverLicense = await DriverLicense.query().where('driverLicenseNumber', driverLicenseNumber).first()

    if (driverLicense) {
      const existingSubscription = await Subscription.query().where({
        emailAddress,
        phoneNumber,
        driverLicenseId: driverLicense.id
      }).first();

      if (driverLicense.disabled || existingSubscription) {
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
    } else {
      driverLicense = await DriverLicense.query().insert({
        driverLicenseNumber,
        county,
        disabled: false
      });
    }


    // DL isn't found, need to create before moving forward

    const subscription = await Subscription.query().insert({
      emailAddress,
      phoneNumber,
      driverLicenseId: driverLicense.id,
      county,
      createdOn: new Date(),
      subscribedOn: new Date()
    });
    console.dir(`enrolled sending sms`);
    await sendEnrollmentConfirmation(phoneNumberClient, driverLicenseIdClient);

    try {

      const {
        reportInnerText
      } = await browardCountyCDLCheck(driverLicense.driverLicenseNumber);

      const message = await sendReportSMS(phoneNumber, driverLicense.driverLicenseNumber, reportInnerText, 'Broward County Clerk Of Courts');
      const messageResult = message[0];
      delete messageResult.body;

      // TODO handle messge response if error.

      await Notification.query().insert({
        driverLicenseId: subscription.driverLicenseId,
        contactMethod: 'SMS',
        subscriptionId: subscription.id,
        notificationRequestResponse: messageResult,
        county: subscription.county,
        status: messageResult.status
      });

    } catch (error) {
      // log errors and alert better
      console.dir(error);
    }
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