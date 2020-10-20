const env = process.env

module.exports = {
  "development": {
    "username": "postgres",
    "password": "root",
    "database": "gist_bot_dev",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "root",
    "database": "gist_bot_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": env.DB_USERNAME,
    "password": env.DB_PASSWORD,
    "database": env.DB_NAME,
    "host": env.DB_HOST,
    "dialect": "postgres"
  }
}