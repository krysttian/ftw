'use strict';

exports.up = async function(knex) {

      await knex.schema.createTable('drivers_license_report', function (table) {
        table.uuid('id').primary();
        table.jsonb('report').comment('Report result');
        // CREATE ENUM
        table.enu('county', ['MIAMI-DADE', 'BROWARD', 'PALM-BEACH', 'ORANGE'], { useNative: true, enumName: 'contact_method' })
        table.uuid('drivers_license_id').unsigned();
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
    .dropTable('drivers_license_report')
    return Promise.resolve();
  };