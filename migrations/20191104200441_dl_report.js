'use strict';

exports.up = async function(knex) {
      await knex.schema.createTable('driver_license_report', function (table) {
        table.uuid('id').primary();
        table.uuid('driver_license_id').unsigned().notNullable();
        table.foreign('driver_license_id').references('driver_license.id').onDelete('CASCADE');
        table.text('report').notNullable().comment('report stored in original format');
        table.jsonb('report_jsonb').notNullable().comment('report stored as a JSONB');
        table.enu('county', null, { useNative: true, existingType: true, enumName: 'florida_counties', schemaName: 'public' }).notNullable().comment('County the report is pulled from');
        table.timestamp('created_on').defaultTo(knex.fn.now());
        table.timestamp('modified_on');
      });

      return Promise.resolve();
  };
  
  exports.down = async function(knex) {
    await knex.schema
    .dropTable('driver_license_report')

    return Promise.resolve();
  };