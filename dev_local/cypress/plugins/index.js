/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const fg = require('@pulipuli.chen/fast-glob')

async function getValues () {

  let baseDir = path.join(__dirname, '../../../')
  const entries = await fg([
    path.join(baseDir, 'deploy/values.yaml'), 
    path.join(baseDir, 'config/**/*.yaml'), 
  ], { dot: true });

  let config = {}

  entries.forEach(entry => {
    let localConfig = yaml.load(fs.readFileSync(entry, 'utf8'))
    
    Object.keys(localConfig).forEach(key => {
      config[key] = localConfig[key]
    })
  })
  
  return config
}

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = async function (on, config) {

  const values = await getValues()
  //console.log(c)
  config.env.values = values
  if (process.env.CI_PROJECT_NAME) {
    let domain_suffix = values.environment.project.domain_suffix
    let suffixDomainName = process.env.CI_PROJECT_NAME + '.' + process.env.CI_PROJECT_NAMESPACE +  '.' + domain_suffix

    config.env.APP_URL = 'http://' + suffixDomainName + '/'

    if (values.deploy.admin_only_vpn) {
      let {from, to} = values.environment.project.vpn_mapping
      domain_suffix = domain_suffix.replace(from, to)
      let port = values.environment.app.vpn_redirect.port_vpn_http
      suffixDomainName = process.env.CI_PROJECT_NAME + '.' + process.env.CI_PROJECT_NAMESPACE +  '.' + domain_suffix + ':' + port
    }

    config.env.ADMIN_URL = 'http://' + 'admin.' + suffixDomainName + '/'

    console.log('=======================================')
    console.log('[APP URL]\n' + config.env.APP_URL)
    console.log('[ADMIN URL]\n' + config.env.ADMIN_URL)
    console.log('=======================================')
    config.env.DEV_LOCAL = false
  }
  else {
    config.env.APP_URL = 'http://localhost:' + values.environment.app.app.port_dev + '/'
    config.env.ADMIN_URL = 'http://localhost:' + values.environment.app.admin.port_dev + '/'
    config.env.DEV_LOCAL = true
  }

  //require("cypress-fail-fast/plugin")(on, config);

  return config
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
}
