'use strict';

exports.up = async function(knex) {
      await knex.schema.createTable('drivers_license', function (table) {
        table.uuid('id').primary();
        table.string('dob').notNullable().comment('DOB for DL being subscribed to');
        table.text('drivers_license_number').notNullable().comment('DL Number');
        table.enu('county', null, { useNative: true, existingType: true, enumName: 'county', schemaName: 'public' }).notNullable().comment('This is the list of supported counties');
        table.boolean('disabled').defaultTo(false).notNullable().comment('Use to indicate this DL should be ignored');
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('drivers_license')

    return Promise.resolve();
  };