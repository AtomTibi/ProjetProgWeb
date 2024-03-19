
//AVANT UTILISATION DOCKER
// const pg = require('pg');
// const pool = new pg.Pool({
//     user: "atomtibi",
//     host: 'localhost',
//     database: 'webproject',
//     password: 'thib', // Aucun mot de passe
//     port: 5432
// });

// pool.connect();

// module.exports = pool;


//AVEC UTILISATION DOCKER

const pg = require('pg');
const pool = new pg.Pool({
    user: process.env.POSTGRES_USER || "postgres",
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'webproject',
    password: process.env.POSTGRES_PASSWORD || 'thib',
    port: process.env.POSTGRES_PORT || 5432
});

pool.connect();

module.exports = pool;
