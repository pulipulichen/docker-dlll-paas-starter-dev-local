const path = require('path')

module.exports = {
  arrayPush: function (obj, key, values) {
    if (!Array.isArray(values)) {
      return
    }

    if (!Array.isArray(obj[key])) {
      obj[key] = []
    }

    values.forEach((value) => {
      if (obj[key].indexOf(value) === -1) {
        obj[key].push(value)
      }
    })
  },
  mapAppend: function (obj, key, values) {
    if (!values) {
      return
    }

    if (typeof(values) !== 'object' || 
        Array.isArray(values)) {
      return
    }

    if (typeof(obj[key]) !== 'object') {
      obj[key] = {}
    }

    Object.keys(values).forEach(function (valueKey) {
      obj[key][valueKey] = values[valueKey]
    })
  },
  setupDBPersistData: function (ymlJSON, config, moduleName, dataPath) {
    let localPath
    //console.log(moduleName, config.data.persist_data)
    if (config.data.persist_data === false) {
      localPath = moduleName + '_temp_vol'
      ymlJSON = this.buildTempVolume(ymlJSON, localPath)
    }
    else {
      
      localPath = path.join(config.dev_local.projectBasePath, 'tmp/dev_local/pvc/database-' + moduleName + '/')
      if (config.publish_mode) {
        localPath = './pvc/database-' + moduleName + '/'
      }
    }
    
    this.arrayPush(ymlJSON.services['database_' + moduleName], 'volumes', [
      localPath + ':' + dataPath + ':rw'
    ])
  
    this.arrayPush(ymlJSON.services.data, 'volumes', [
      localPath + ':/data/database-' + moduleName + ':rw'
    ])
  
    return ymlJSON
  },
  setupAppHost: function (ymlJSON, moduleName) {
    let hostObject = {}
    //hostObject['DATABASE_HOST_' + moduleName.toUpperCase()] = 'database-' + moduleName + '.dev-local'
    hostObject['DATABASE_HOST_' + moduleName.toUpperCase()] = 'database_' + moduleName

    this.mapAppend(ymlJSON.services.app, 'environment', hostObject)
  },
  setupAppEnvironmentDatabase: function (ymlJSON, config, moduleName, settings) {
    let envObject = {}
    //hostObject['DATABASE_HOST_' + moduleName.toUpperCase()] = 'database-' + moduleName + '.dev-local'
    envObject['DATABASE_' + moduleName.toUpperCase() + '_HOST'] = 'database_' + moduleName
    envObject['DATABASE_' + moduleName.toUpperCase() + '_DATABASE'] = config.database.database_name
    envObject['DATABASE_' + moduleName.toUpperCase() + '_USERNAME'] = config.auth.username
    envObject['DATABASE_' + moduleName.toUpperCase() + '_PASSWORD'] = config.auth.password

    if (settings) {
      for (const key in settings) {
        envObject['DATABASE_' + moduleName.toUpperCase() + '_' + key.toUpperCase()] = settings[key]
      }
    }

    this.mapAppend(ymlJSON.services.app, 'environment', envObject)
  },
  buildTempVolume: function (ymlJSON, tempName) {
    if (!ymlJSON.volumes) {
      ymlJSON.volumes = {}
    }

    if (ymlJSON.volumes[tempName]) {
      // 已經設定過了
      return ymlJSON
    }

    ymlJSON.volumes[tempName] = {
      driver_opts: {
        type: 'tmpfs',
        device: 'tmpfs'
      }
    }
    return ymlJSON
  },
  addAppDependsOn: function (ymlJSON, config, moduleName) {
    this.addDependsOn(ymlJSON.services.app, config, 'database_' + moduleName + '_wait')
    return ymlJSON
  },
  addDependsOn: function (ymlJSONObject, config, moduleName) {
    let setting = {}
    setting[moduleName] = {
      //condition: "service_healthy"
      condition: "service_completed_successfully"
    }

    this.mapAppend(ymlJSONObject, 'depends_on', setting)
  },
  createServiceWaitTCP: function (serviceName, port = 80) {
    let service = {
      image: "jwilder/dockerize:0.6.1",
      command: `sh -c "dockerize -wait tcp://${serviceName}:${port} -timeout 600s -wait-retry-interval 3s"`,
      depends_on: [serviceName],
      logging: { driver: 'none'},
    }

    return service
  }
}