'use strict';

exports.up = function up(knex) {
    return knex.schema.raw(`
    ALTER TYPE county RENAME TO county_old;
    CREATE TYPE florida_counties AS ENUM ('ALACHUA','BAKER','BAY','BRADFORD','BREVARD','BROWARD','CALHOUN','CHARLOTTE','CITRUS','CLAY','COLLIER','COLUMBIA','DE SOTO','DIXIE','DUVAL','ESCAMBIA','FLAGLER','FRANKLIN','GADSDEN','GILCHRIST','GLADES','GULF','HAMILTON','HARDEE','HENDRY','HERNANDO','HIGHLANDS','HILLSBOROUGH','HOLMES','INDIAN RIVER','JACKSON','JEFFERSON','LAFAYETTE','LAKE','LEE','LEON','LEVY','LIBERTY','MADISON','MANATEE','MARION','MARTIN','MIAMI-DADE','MONROE','NASSAU','OKALOOSA','OKEECHOBEE','ORANGE','OSCEOLA','PALM BEACH','PASCO','PINELLAS','POLK','PUTNAM','ST. JOHNS','ST. LUCIE','SANTA ROSA','SARASOTA','SEMINOLE','SUMTER','SUWANNEE','TAYLOR','UNION','VOLUSIA','WAKULLA','WALTON','WASHINGTON');
	ALTER TABLE driver_license ALTER COLUMN county TYPE florida_counties
    USING county::text::florida_counties;

    ALTER TABLE driver_license_report ALTER COLUMN county TYPE florida_counties
    USING county::text::florida_counties;

    ALTER TABLE launch_subscriber ALTER COLUMN county TYPE florida_counties
    USING county::text::florida_counties;

    ALTER TABLE notifications ALTER COLUMN county TYPE florida_counties
    USING county::text::florida_counties;

    ALTER TABLE subscription ALTER COLUMN county TYPE florida_counties
    USING county::text::florida_counties;

    DROP TYPE county_old;
`);}


exports.down = function down() {
    return Promise.resolve();
}

