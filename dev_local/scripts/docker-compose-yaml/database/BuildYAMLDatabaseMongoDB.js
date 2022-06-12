const moduleName = 'mongo'

// ---------------------------

const YAMLUtils = require('./../YAMLUtils.js')
const path = require('path')

function setupDB(ymlJSON, config) {
  let {image, port, env, data_path} = config.environment.database[moduleName]

  let service = {
    image: image,
    environment: {
      MONGO_INITDB_ROOT_USERNAME: config.auth.username,
      MONGO_INITDB_ROOT_PASSWORD: config.auth.password
    },
    ports: [
      port + ':' + port
    ],
    logging: {driver: 'none'},
    hostname: 'database-' + moduleName + '.dev-local',
    // depends_on: [
    //   'data'
    // ],
    // https://stackoverflow.com/a/54384377/6645399
    // healthcheck: {
    //   test: `echo 'db.runCommand("ping").ok' | mongo mongo:27017/test --quiet`,
    //   interval: `10s`,
    //   timeout: `10s`,
    //   retries: 5,
    //   start_period: `40s`
    // }
  }

  YAMLUtils.addDependsOn(service, config, 'data_wait')
  YAMLUtils.mapAppend(service, 'environment', env)

  ymlJSON.services['database_' + moduleName] = service
  ymlJSON = YAMLUtils.setupDBPersistData(ymlJSON, config, moduleName, data_path)

  ymlJSON.services['database_' + moduleName + '_wait'] = YAMLUtils.createServiceWaitTCP('database_' + moduleName, port)

  return ymlJSON
} 

function setupDBAdmin(ymlJSON, config) {
  let port_db = config.environment.database[moduleName].port
  let {image, port, port_dev, env} = config.environment.database[moduleName + '_admin']

  let service = {
    image,
    ports: [
      port_dev + ':' + port
    ],
    // depends_on: [
    //   ['database_' + moduleName]
    // ],
    environment: {
      ME_CONFIG_MONGODB_ADMINUSERNAME: config.auth.username,
      ME_CONFIG_MONGODB_ADMINPASSWORD: config.auth.password,
      ME_CONFIG_MONGODB_URL: `mongodb://${config.auth.username}:${config.auth.password}@database-${moduleName}.dev-local:${port_db}/`,
      ME_CONFIG_BASICAUTH_USERNAME: config.auth.username,
      ME_CONFIG_BASICAUTH_PASSWORD: config.auth.password,
    },
    //restart: 'always',
    logging: { driver: 'none' },
    hostname: 'database-' + moduleName + '-admin.dev-local',
    stop_grace_period: '1s'
  }
  
  YAMLUtils.addDependsOn(service, config, 'database_' + moduleName + '_wait')
  YAMLUtils.mapAppend(service, 'environment', env)

  ymlJSON.services['database_' + moduleName + '_admin'] = service

  return ymlJSON
}

module.exports = function (ymlJSON, config) {
  if (config.database.enabled_drivers.indexOf(moduleName) === -1) {
    return ymlJSON
  }

  ymlJSON = setupDB(ymlJSON, config)
  ymlJSON = setupDBAdmin(ymlJSON, config)
  //YAMLUtils.setupAppHost(ymlJSON, moduleName)

  let port = config.environment.database[moduleName].port
  YAMLUtils.setupAppEnvironmentDatabase(ymlJSON, config, moduleName, {
    host: "database-" + moduleName + '.dev-local:' + port
  })
  YAMLUtils.addAppDependsOn(ymlJSON, config, moduleName)
  
  return ymlJSON
}