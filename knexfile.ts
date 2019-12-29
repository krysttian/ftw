module.exports = {
    client: 'postgresql',

    connection: process.env.DATABASE_URL,
    pool: {
      min: 1,
      max: 2
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
