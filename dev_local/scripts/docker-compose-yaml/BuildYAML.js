const fs = require('fs')
const path = require('path')

const LoadHelmValues = require('./../lib/LoadHelmValues.js')
const toYAML = require('json-to-pretty-yaml')

const BuildYAMLDatabase = require('./database/BuildYAMLDatabase.js')
const BuildYAMLApp = require('./BuildYAMLApp.js')
const BuildYAMLData = require('./gadget/BuildYAMLData.js')
const BuildYAMLConsole = require('./gadget/BuildYAMLConsole.js')
const BuildYAMLAdmin = require('./gadget/BuildYAMLAdmin.js')

module.exports = async function (options) {
  const config = await LoadHelmValues()
  
  if (options.mode === 'publish') {
    config.publish_mode = true
  }

  let ymlJSON = {
    version: "3.5",
    services: {}
  }

  //console.log(ymlJSON)

  ymlJSON = BuildYAMLData(ymlJSON, config)
  ymlJSON = BuildYAMLApp(ymlJSON, config)
  ymlJSON = BuildYAMLAdmin(ymlJSON, config)
  ymlJSON = BuildYAMLConsole(ymlJSON, config)
  
  ymlJSON = BuildYAMLDatabase(ymlJSON, config)

  let ymlString = toYAML.stringify(ymlJSON)
  console.log(ymlString)

  let dockerComposePath = path.join(config.dev_local.projectBasePath, 'tmp/dev_local/yml/docker-compose.yml')

  if (config.publish_mode) {
    dockerComposePath = path.join(config.dev_local.projectBasePath, 'tmp/publish/build/docker-compose.yml')
  }

  fs.writeFileSync(dockerComposePath, ymlString, 'utf8');

  return true
}