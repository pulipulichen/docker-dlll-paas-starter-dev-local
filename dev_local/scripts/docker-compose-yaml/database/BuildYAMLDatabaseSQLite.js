const moduleName = 'sqlite'

// -----------------------------

const YAMLUtils = require('./../YAMLUtils.js')
const path = require('path')

function setupDB(ymlJSON, config) {
  let {image, port, data_path, port_dev, env} = config.environment.database[moduleName]

  let service = {
    image,
    environment: {
      PASSWORD: config.auth.password
    },
    ports: [
      port_dev + ':' + port
    ],
    logging: { driver: 'none' },
    hostname: 'database-' + moduleName + '.dev-local',
    // depends_on: [
    //   'data'
    // ],
    stop_grace_period: '1s',
    // healthcheck: {
    //   test: `bash -c "[ -f /data/database.sqlite ]"`,
    //   timeout: '45s',
    //   interval: '10s',
    //   retries: 10
    // }
  }

  YAMLUtils.addDependsOn(service, config, 'data_wait')
  YAMLUtils.mapAppend(service, 'environment', env)
  ymlJSON.services['database_' + moduleName] = service

  ymlJSON = YAMLUtils.setupDBPersistData(ymlJSON, config, moduleName, data_path)
  return ymlJSON
} 

function setupAppSQLite (ymlJSON, config) {
  //const AppDBPath = config.environment.database[moduleName].app_path
  

  YAMLUtils.mapAppend(ymlJSON.services.app, 'environment', {
    DATABASE_SQLITE_HOST: config.environment.database[moduleName].app_path + '/database.sqlite',
  })
  
  let localPath
  //console.log(moduleName, config.data.persist_data)
  if (config.data.persist_data === false) {
    localPath = moduleName + '_temp_vol'
    ymlJSON = YAMLUtils.buildTempVolume(ymlJSON, localPath)
  }
  else {
    localPath = path.join(config.dev_local.projectBasePath, 'tmp/dev_local/pvc/database-' + moduleName + '/')
    if (config.publish_mode) {
      localPath = './pvc/database-' + moduleName + '/'
    }
  }

  YAMLUtils.arrayPush(ymlJSON.services.app, 'volumes', [
    localPath + ':' + config.environment.database[moduleName].app_path + ':rw'
  ])

  return ymlJSON
}

module.exports = function (ymlJSON, config) {
  
  if (config.database.enabled_drivers.indexOf(moduleName) === -1) {
    return ymlJSON
  }

  ymlJSON = setupDB(ymlJSON, config)
  ymlJSON = setupAppSQLite(ymlJSON, config)
  //YAMLUtils.addAppDependsOn(ymlJSON, config, moduleName)
  
  return ymlJSON
}