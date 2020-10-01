'use strict';

exports.up = function(knex) {
    try {
        return knex.schema.hasTable('notifications').then(function (exists) {
            if (exists) {
                return knex.schema.alterTable('notifications', function (table) {
                    table.jsonb('notification_request_response').comment('Response from message provider').alter();
                });
            }
        });
    } catch (error) {
        console.dir(error);
        return Promise.reject();
    }
};

exports.down = function (knex) {
    return Promise.resolve();
};