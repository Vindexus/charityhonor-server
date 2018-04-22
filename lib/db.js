const config    = require('../config/config.json')
const Sequelize = require('sequelize')

let dbConfig

if (process.env.NODE_ENV) {
  dbConfig = config[process.env.NODE_ENV]
}
else {
  dbConfig = config.development
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  dialect: 'postgres'
})

module.exports = sequelize
