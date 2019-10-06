import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as Knex from 'knex';
import {Model, knexSnakeCaseMappers} from 'objection';

const knexConfig = require('./knexfile');

export const knex = Knex({...knexConfig, ...knexSnakeCaseMappers()});

Model.knex(knex);

import {validateEmail} from './validators'
import {LaunchSubscriber, Counties} from './models/launchSubscriber';

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
