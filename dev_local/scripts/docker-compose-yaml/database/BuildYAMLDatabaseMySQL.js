const moduleName = 'mysql'
const enableConsole = false

// ---------------------------

const YAMLUtils = require('./../YAMLUtils.js')

function setupDB(ymlJSON, config) {

  let {image, port, data_path, env} = config.environment.database[moduleName] 

  let service = {
    image: image,
    environment: {
      MYSQL_ROOT_PASSWORD: config.auth.password,
      MYSQL_DATABASE: config.database.database_name,
      MYSQL_USER: config.auth.username,
      MYSQL_PASSWORD: config.auth.password
    },
    ports: [
      port + ':' + port
    ],
    //logging: { driver: 'none' },
    hostname: 'database-' + moduleName + '.dev-local',
    // depends_on: [
    //   'data'
    // ],
    stop_grace_period: '1s',
    // healthcheck: {
    //   test: "mysqladmin ping -h localhost",
    //   timeout: `5s`,
    //   retries: 3
    // }
  }

  if (!enableConsole) {
    service.logging = { driver: 'none' }
  }

  YAMLUtils.addDependsOn(service, config, 'data_wait')
  YAMLUtils.mapAppend(service, 'environment', env)

  ymlJSON.services['database_' + moduleName] = service
  ymlJSON.services['database_' + moduleName + '_wait'] = YAMLUtils.createServiceWaitTCP('database_' + moduleName, port)

  ymlJSON = YAMLUtils.setupDBPersistData(ymlJSON, config, moduleName, data_path)

  return ymlJSON
} 

function setupDBAdmin(ymlJSON, config) {
  let port_db = config.environment.database[moduleName].port
  let {image, port, port_dev, port_dev_https, env} = config.environment.database[moduleName + '_admin']

  let service = {
    image,
    ports: [
      port_dev + ':' + port_dev
    ],
    environment: {
      DATABASE_HOST: 'database_' + moduleName,
      DATABASE_POST: port_db,
      APACHE_HTTP_PORT_NUMBER: port_dev,
      APACHE_HTTPS_PORT_NUMBER: port_dev_https
    },
    //logging: { driver: 'none' },
    hostname: 'database-' + moduleName + '-admin.dev-local',
    // depends_on: [
    //   'database-' + moduleName
    // ],
    stop_grace_period: '1s'
  }

  if (!enableConsole) {
    service.logging = { driver: 'none' }
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
  YAMLUtils.setupAppEnvironmentDatabase(ymlJSON, config, moduleName)
  YAMLUtils.addAppDependsOn(ymlJSON, config, moduleName)

  return ymlJSON
}