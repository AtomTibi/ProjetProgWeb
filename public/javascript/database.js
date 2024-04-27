const pg = require('pg');

const pool = new pg.Pool({
    user: process.env.POSTGRES_USER || "postgres",
    host: process.env.POSTGRES_HOST || 'db',
    database: process.env.POSTGRES_DB || 'webproject',
    password: process.env.POSTGRES_PASSWORD || 'thib',
    port: process.env.POSTGRES_PORT || 5432
});

const connectWithRetry = () => {
  pool.connect(err => {
    if (err) {
      console.error('Échec de connexion à la base de données, réessai dans 5 secondes', err.stack);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Connecté à la base de données');
    }
  });
};

connectWithRetry();

module.exports = pool;

