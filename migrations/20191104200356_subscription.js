'use strict';

exports.up = async function(knex) {
      await knex.schema.createTable('subscription', function (table) {
        table.uuid('id').primary();
        table.string('email_address').notNullable().comment('This is the email field');
        table.string('phone_number').notNullable().comment('This is the phone number field');
        table.uuid('drivers_license_id').notNullable().unsigned();
        table.foreign('drivers_license_id').references('drivers_license.id').onDelete('CASCADE');
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('subscribed_on').defaultTo(knex.fn.now());
        table.timestamp('unsubscribed_on');
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('subscription')

    return Promise.resolve();
  };