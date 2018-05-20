# Project Setup
`npm install`

## Create a PostgresSQL database
Remember the user and database name.

## Create Sequelize config file
Copy the `config/config.example.json` file to `config/config.json`. Change the credentials to match the database you created before.

## Create Main Config File
Copy the contents of `config/development.example.js` to `config/development.js`.

## Get Reddit OAuth credentials
Use [this project](https://github.com/not-an-aardvark/reddit-oauth-helper) to get the credentials that you will paste into your `config/development.js` file.

## Create Database
Create all the required db tables with `node_modules/.bin/sequelize db:migrate`  
Seed some initial data with `node_modules/.bin/sequelize db:seed`

## Run the App
`npm run dev`
