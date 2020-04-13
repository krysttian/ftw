'use strict';

exports.up = async function(knex) {
      await knex.schema.createTable('launch_subscriber', function (table) {
        table.uuid('id').primary();
        table.string('email_address').unique().comment('This is the email field');
        table.enu('county', ['MIAMI-DADE', 'BROWARD', 'PALM-BEACH', 'ORANGE'], { useNative: true, enumName: 'county', schemaName:'public' }).notNullable().comment('This is the list of supported counties');
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('subscribed_on').defaultTo(knex.fn.now());
        table.timestamp('unsubscribed_on');
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('launch_subscriber')

    return Promise.resolve();
  };