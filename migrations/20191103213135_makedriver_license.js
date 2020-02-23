'use strict';

exports.up = async function(knex) {
      await knex.schema.createTable('driver_license', function (table) {
        table.uuid('id').primary();
        table.text('driver_license_number').notNullable().comment('DL Number');
        table.enu('county', null, { useNative: true, existingType: true, enumName: 'county', schemaName: 'public' }).notNullable().comment('This is the list of supported counties');
        table.boolean('disabled').defaultTo(false).notNullable().comment('Use to indicate this DL should be ignored');
        table.timestamp('created_on').defaultTo(knex.fn.now())
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('driver_license')

    return Promise.resolve();
  };