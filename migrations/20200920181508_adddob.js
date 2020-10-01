exports.up = function(knex) {
    return knex.schema.hasTable('driver_license').then(function(exists) {
        if (exists) {
          return knex.schema.table('driver_license', function(t) {
            t.date('date_of_birth').nullable().comment('optional Column with user inputed dob')
          });
        }
        throw new Error ('this table does not exist, it really should');
      });
}


exports.down = function(knex) {
    return knex.schema.hasTable('driver_license').then(function(exists) {
        if (exists) {
          return knex.schema.table('driver_license', function(t) {
            t.dropColumn('date_of_birth');
          });
        }
        throw new Error ('this table does not exist, it really should');
      });
}