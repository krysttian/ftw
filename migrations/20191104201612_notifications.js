'use strict';

exports.up = async function(knex) {
      await knex.schema.createTable('notifications', function (table) {
        // TWILIO SUGGESTED ROW?
        table.uuid('id').primary();
        table.uuid('subscription_id').unsigned();
        table.foreign('subscription_id').references('subscription.id');
        table.uuid('driver_license_id').unsigned().notNullable();
        table.foreign('driver_license_id').references('driver_license.id').onDelete('CASCADE');
        table.jsonb('notification_request_response').notNullable().comment('Response from message provider');
        table.enu('contact_method', ['SMS', 'EMAIL', 'SMS+EMAIL', 'OTHER'], { useNative: true, enumName: 'contact_method' });
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('sent_on').defaultTo(knex.fn.now());
        table.enu('county', null, { useNative: true, existingType: true, enumName: 'county', schemaName: 'public' }).notNullable().comment('County the report is pulled from');
        table.text('status').notNullable();
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('notifications')

    return Promise.resolve();
  };