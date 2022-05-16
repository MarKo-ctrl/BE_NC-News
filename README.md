In order to have access to the data, after you clone the repo and assuming you have PostgresSQL set up, create two new files, one for testing and one for development, to set the Postgres database environment variable accordingly:

- .env.test: PGDATABASE=nc_news_test
- .env.development: PGDATABASE=nc_news