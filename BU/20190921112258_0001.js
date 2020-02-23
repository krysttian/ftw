'use strict';

exports.up = async function(knex) {

      await knex.schema.createTable('driver_license', function (table) {
        table.uuid('id').primary();
        // TODO move to pgcrypto Column Encryption
        table.string('driver_license_number').unique().comment('This is the driverLicense');
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('subscribed_on').defaultTo(knex.fn.now());
        table.timestamp('unsubscribed_on');
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('driver_license')

    return Promise.resolve();
  };