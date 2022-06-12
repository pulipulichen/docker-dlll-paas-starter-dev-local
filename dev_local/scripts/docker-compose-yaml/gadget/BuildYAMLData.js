const YAMLUtils = require('./../YAMLUtils.js')
const path = require('path')

module.exports = function (ymlJSON, config) {
  let moduleName = 'data'

  let {image, port_dev} = config.environment.app[moduleName]

  let localVolumesPath = path.join(config.dev_local.projectBasePath, moduleName)
  if (config.publish_mode) {
    localVolumesPath = './' + moduleName + '/'
  }

  let service = {
    image,
    ports: [
      port_dev + ':80'
    ],
    hostname: moduleName + '.dev-local',
    logging: { driver: 'none'},
    environment: {
      FM_USERNAME: config.auth.username,
      FM_PASSWORD: config.auth.password,
    },
    volumes: [
      localVolumesPath + ":/docker-entrypoint-init:rw"
    ],
    stop_grace_period: '1s'
  }

  //YAMLUtils.addHealthCheckCurl(service, config)

  ymlJSON.services[moduleName] = service
  ymlJSON.services[moduleName + '_wait'] = YAMLUtils.createServiceWaitTCP(moduleName)

  return ymlJSON
}