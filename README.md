# 1. Installing dotenv

Before we can connect to the database you will need to run this command into your terminal:

* `npm install dotenv`

This will install the dotenv package

The `dotenv` package allows you to store your sensitive information in a separate file called `.env` that is not committed to your source control repository. This way, you can keep your sensitive information private and avoid exposing it to the public.


# 2. Creating .env files & storing databases

Once installed you can commence to creating a new file called `.env.development` and insert `PGDATABASE=nc_news` into the file and that will hold the database when development is being accessed.

You will need to create another file called `.env.test` and insert `PGDATABASE=nc_news_test` into the file.

`.env.test` will be useful when building our application as it will allow us to connect to the test database during production and hopefully avoid issues down the line when we have to access the actual data.  