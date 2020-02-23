'use strict';

exports.up = async function(knex) {
      await knex.schema.createTable('notifications', function (table) {
        table.uuid('id').primary();
        table.uuid('subscription_id').unsigned();
        table.foreign('subscription_id').references('subscription.id');
        table.uuid('driver_license_report_id').unsigned();
        table.foreign('driver_license_report_id').references('driver_license_report.id');
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('sent_on').defaultTo(knex.fn.now());
        table.text('status');
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('notifications')

    return Promise.resolve();
  };