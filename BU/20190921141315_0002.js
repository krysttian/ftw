'use strict';

exports.up = async function(knex) {

      await knex.schema.createTable('driver_license_report', function (table) {
        table.uuid('id').primary();
        table.jsonb('refrence').comment('Message refrence');
        // CREATE ENUM
        table.enu('contact_method', ['SMS', 'EMAIL', 'SMS+EMAIL', 'OTHER'], { useNative: true, enumName: 'contact_method' })
        table.uuid('driver_license_id').unsigned();
        table.foreign('driver_license_id').references('driver_license.id').onDelete('CASCADE');
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('subscribed_on').defaultTo(knex.fn.now());
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('driver_license_report')
    return Promise.resolve();
  };