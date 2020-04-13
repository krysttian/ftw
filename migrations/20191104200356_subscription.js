'use strict';

exports.up = async function(knex) {
      await knex.schema.createTable('subscription', function (table) {
        table.uuid('id').primary();
        table.string('email_address').notNullable().comment('This is the email field');
        table.string('phone_number').comment('This is the phone number field');
        table.uuid('driver_license_id').notNullable().unsigned();
        table.foreign('driver_license_id').references('driver_license.id').onDelete('CASCADE');
        table.enu('county', null, { useNative: true, existingType: true, enumName: 'county', schemaName: 'public' }).notNullable().comment('This is the list of supported counties');
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('subscribed_on').defaultTo(knex.fn.now());
        table.timestamp('unsubscribed_on').comment('either due to stop notification from user, OR  twilio webhook or manual intervention');
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('subscription')

    return Promise.resolve();
  };