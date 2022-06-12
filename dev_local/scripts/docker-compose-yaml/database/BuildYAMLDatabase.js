//const BuildYAMLDatabaseApp = require('./BuildYAMLDatabaseApp.js')
const BuildYAMLDatabaseMySQL = require('./BuildYAMLDatabaseMySQL.js')
const BuildYAMLDatabasePgSQL = require('./BuildYAMLDatabasePgSQL.js')
const BuildYAMLDatabaseSQLite = require('./BuildYAMLDatabaseSQLite.js')
const BuildYAMLDatabaseNeo4j = require('./BuildYAMLDatabaseNeo4j.js')
const BuildYAMLDatabaseMongoDB = require('./BuildYAMLDatabaseMongoDB.js')

//const BuildYAMLDatabaseRestore = require('../../trash/20220508-1805/BuildYAMLDatabaseRestore.js')

const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')

module.exports = function (ymlJSON, config) {
  if (!config.database.enabled_drivers || 
    (Array.isArray(config.database.enabled_drivers) && config.database.enabled_drivers.length === 0)) {
    return ymlJSON
  }

  //ymlJSON = BuildYAMLDatabaseApp(ymlJSON, config)
  
  ymlJSON = BuildYAMLDatabaseMySQL(ymlJSON, config)
  ymlJSON = BuildYAMLDatabasePgSQL(ymlJSON, config)
  ymlJSON = BuildYAMLDatabaseSQLite(ymlJSON, config)
  ymlJSON = BuildYAMLDatabaseNeo4j(ymlJSON, config)
  ymlJSON = BuildYAMLDatabaseMongoDB(ymlJSON, config)


  //BuildYAMLDatabaseRestore(config)

  return ymlJSON
}