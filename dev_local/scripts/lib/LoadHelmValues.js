const fs = require('fs')
const path = require('path')

const fg = require('@pulipuli.chen/fast-glob')
const yaml = require('js-yaml')

module.exports = async function () {

  let baseDir = path.join(__dirname, '../../../')
  const entries = await fg([
    path.join(baseDir, 'deploy/values.yaml'), 
    path.join(baseDir, 'config/**/*.yaml'), 
    // "../../../config/**/*.yaml"
  ]);

  let config = {}

  // console.log({baseDir, entries, 'config': path.join(baseDir, 'config/**/*.yaml')})

  entries.forEach(entry => {
    let localConfig = yaml.load(fs.readFileSync(entry, 'utf8'))
    
    Object.keys(localConfig).forEach(key => {
      config[key] = localConfig[key]
    })
  })

  if (!config.dev_local) {
    config.dev_local = {}
  }
  config.dev_local.projectBasePath = path.join(__dirname, '../../../')
  
  

  return config
}