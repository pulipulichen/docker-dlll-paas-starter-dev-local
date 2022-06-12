const moduleName = 'pgsql'

// ---------------------------

const YAMLUtils = require('./../YAMLUtils.js')

function setupDB(ymlJSON, config) {
  let {image, port, data_path, env} = config.environment.database[moduleName]

  let service = {
    image,
    environment: {
      POSTGRES_ROOT_PASSWORD: config.auth.password,
      POSTGRES_DB: config.database.database_name,
      POSTGRES_USER: config.auth.username,
      POSTGRES_PASSWORD: config.auth.password
    },
    ports: [
      port + ':' + port
    ],
    logging: { driver: 'none' },
    hostname: 'database-' + moduleName + '.dev-local',
    // depends_on: [
    //   'data'
    // ],
    stop_grace_period: '1s',
    // https://marcopeg.com/docker-compose-healthcheck/
    // healthcheck: {
    //   test: "pg_isready",
    //   timeout: '45s',
    //   interval: '10s',
    //   retries: 10
    // }
  }

  YAMLUtils.addDependsOn(service, config, 'data_wait')
  YAMLUtils.mapAppend(service, 'environment', env)

  ymlJSON.services['database_' + moduleName] = service
  ymlJSON.services['database_' + moduleName + '_wait'] = YAMLUtils.createServiceWaitTCP('database_' + moduleName, port)

  //ymlJSON = YAMLUtils.setupDBPersistData(ymlJSON, config, moduleName, '/usr/local/pgsql/data')
  ymlJSON = YAMLUtils.setupDBPersistData(ymlJSON, config, moduleName, data_path)
  
  return ymlJSON
} 

function setupDBAdmin(ymlJSON, config) {
  let {image, port, port_dev, env} = config.environment.database[moduleName + '_admin']

  let service = {
    image,
    ports: [
      port_dev + ':' + port
    ],
    environment: {
      DATABASE_HOST: 'database_' + moduleName,
    },
    logging: { driver: 'none' },
    hostname: 'database-' + moduleName + '-admin.dev-local',
    // depends_on: [
    //   'database-' + moduleName
    // ],
    stop_grace_period: '1s'
  }

  YAMLUtils.mapAppend(service, 'environment', env)
  YAMLUtils.addDependsOn(service, config, 'database_' + moduleName + '_wait')
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
  YAMLUtils.setupAppEnvironmentDatabase(ymlJSON, config, moduleName)
  YAMLUtils.addAppDependsOn(ymlJSON, config, moduleName)
  
  return ymlJSON
}