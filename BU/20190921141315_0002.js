'use strict';

exports.up = async function(knex) {

      await knex.schema.createTable('driver_license_report', function (table) {
        table.uuid('id').primary();
        table.jsonb('report').comment('Report result');
        // CREATE ENUM
        table.enu('county', ['MIAMI-DADE', 'BROWARD', 'PALM-BEACH', 'ORANGE'], { useNative: true, enumName: 'contact_method' })
        table.uuid('driver_license_id').unsigned();
        table.foreign('driver_license_id').references('driver_license.id').onDelete('CASCADE');
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('subscribed_on').defaultTo(knex.fn.now());
        table.timestamp('unsubscribed_on');
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('driver_license_report')
    return Promise.resolve();
  };