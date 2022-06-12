const YAMLUtils = require('./YAMLUtils.js')
const path = require('path')
const moduleName = 'app'
const dataModuleName = 'data'

function setData (ymlJSON, config) {
  if (config.data.persist_data) {
    let volPath = path.join(config.dev_local.projectBasePath, 'tmp/dev_local/pvc/app')
    if (config.publish_mode) {
      volPath = './pvc/app'
    }

    YAMLUtils.arrayPush(ymlJSON.services[moduleName], 'volumes', [
      volPath + ':' + config[moduleName].data_path + ':rw'
    ])

    YAMLUtils.arrayPush(ymlJSON.services.data, 'volumes', [
      volPath + `:/data/${moduleName}:rw`
    ])
  }
  else {
    let tempVol = `${moduleName}_tmp_vol`
    ymlJSON = YAMLUtils.buildTempVolume(ymlJSON, tempVol)
    YAMLUtils.arrayPush(ymlJSON.services[moduleName], 'volumes', [
      tempVol + ':' + config[moduleName].data_path + ':rw'
    ])

    YAMLUtils.arrayPush(ymlJSON.services[dataModuleName], 'volumes', [
      tempVol + `:/data/${moduleName}:rw`
    ])
  }

  return ymlJSON
}

module.exports = function (ymlJSON, config) {
  
  let baseDir = path.join(config.dev_local.projectBasePath).slice(0, -1)

  let appPathConfig = [
    path.join(baseDir, '/' + moduleName) + ':' + config[moduleName].app_path,
  ]
  if (config.publish_mode) {
    appPathConfig = []
  }

  let service = {
    volumes: appPathConfig,
    ports: [
      config.environment.app[moduleName].port_dev + ':' + config[moduleName].port,
    ],
    hostname: moduleName + '.dev-local',
    environment: {
      APP_USERNAME: config[moduleName].Dockerfile.USER,
      AUTH_PASSWORD: config.auth.password,
      DATA_PATH: config[moduleName].data_path
    },
    stop_grace_period: "1s",
    //logging: { driver: 'none'},
  }

  if (!config.publish_mode) {
    service.build = {
      context: baseDir,
      dockerfile: path.join(baseDir, '/tmp/dev_local/yml/Dockerfile')
    }
  }
  else {
    service.image = config.deploy.publish_dockerhub
  }  


  YAMLUtils.addDependsOn(service, config, 'data_wait')
  //YAMLUtils.addHealthCheckApache(service, config)

  let env = config[moduleName].Dockerfile.ENV
  YAMLUtils.mapAppend(service, 'environment', env)

  ymlJSON.services[moduleName] = service
  ymlJSON.services[moduleName + '_wait'] = YAMLUtils.createServiceWaitTCP(moduleName)
  ymlJSON = setData(ymlJSON, config)

  return ymlJSON
}