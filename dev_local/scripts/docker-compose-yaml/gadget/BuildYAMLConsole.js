const YAMLUtils = require('./../YAMLUtils.js')
const path = require('path')

const moduleName = 'console'

module.exports = function (ymlJSON, config) {

  let {image, port_dev} = config.environment.app[moduleName]

  let service = {
    image,
    ports: [
      port_dev + ':8888'
    ],
    hostname: moduleName + '.dev-local',
    logging: { driver: 'none' },
    environment: {
      SSH_HOSTNAME: 'app'
    },
    // depends_on: [
    //   'app'
    // ],
    stop_grace_period: '1s'
  }

  YAMLUtils.addDependsOn(service, config, 'app_wait')

  ymlJSON.services[moduleName] = service

  return ymlJSON
}