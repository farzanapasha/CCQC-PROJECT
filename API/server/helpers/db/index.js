import Defines from '../../config';

module.exports = require('knex')({
    client: 'mysql',
    connection: {
        user: Defines.DB_USER,
        database: Defines.DB_NAME,
        port: Defines.DB_PORT,
        host: Defines.DB_HOST,
        password: Defines.DB_PASS
    },
    debug: false,
    pool: {
        min: 2,
        max: 5
    }
});