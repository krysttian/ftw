'use strict';

exports.up = async function(knex) {

      await knex.schema.createTable('subscriber', function (table) {
        table.uuid('id').primary();
        table.string('email_address').comment('This is the email field');
        table.string('phone_number').comment('This is the phone field');
        table.enu('contact_method', ['SMS', 'PHONE', 'EMAIL', 'BOTH'], { useNative: true, enumName: 'contact_method' }).comment('This is the phone field');
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('subscribed_on').defaultTo(knex.fn.now());
        table.timestamp('unsubscribed_on');
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('email_subscriber')

    return Promise.resolve();
  };