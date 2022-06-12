const YAMLUtils = require('./../YAMLUtils.js')

function getDevPorts(config) {
  let devPorts = {}

  let searchEntries = [
    config.environment.app,
    config.environment.database,
  ]
  
  searchEntries.forEach(searchEntry => {
    Object.keys(searchEntry).forEach(moduleName => {
      let moduleConfig = searchEntry[moduleName]

      if (!moduleConfig.port_dev) {
        return false
      }

      devPorts[moduleName] = moduleConfig.port_dev
    })
  })

  return devPorts
}

module.exports = function (ymlJSON, config) {
  let moduleName = 'admin'
  let {image, port_dev, port_admin, service_server} = config.environment.app[moduleName]
  let service = {
    image,
    ports: [
      port_dev + ':' + port_admin
    ],
    hostname: moduleName + '.dev-local',
    logging: { driver: 'none' },
    environment: {
      ENV_DATABASE_DRIVERS: JSON.stringify(config.database.enabled_drivers),
      ENV_DEV_LOCAL_PORTS: JSON.stringify(getDevPorts(config)),
      // ENV_DATABASE_SERVICES: JSON.stringify(config.environment.database),
      ENV_DATABASE_SERVICES: '{}'
    },
    // depends_on: {
    //   app: {
    //     condition: "service_started"
    //   }
    // },
    stop_grace_period: '1s'
  }

  YAMLUtils.addDependsOn(service, config, 'app_wait')

  ymlJSON.services[moduleName] = service

  if (service_server) {
    YAMLUtils.mapAppend(ymlJSON.services[moduleName], 'environment', {
      ENV_SERVICE_SERVER: service_server
    })
  }

  //YAMLUtils.addHealthCheckCurl(ymlJSON.services.admin, config)

  return ymlJSON
}