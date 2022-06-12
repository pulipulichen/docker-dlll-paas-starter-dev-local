const fs = require('fs-extra');
const path = require('path');

const LoadHelmValues = require('../lib/LoadHelmValues');
const copyPromise = require('./Copy.js')

async function prepare () {
  let config = await LoadHelmValues()

  let baseDir = path.join(config.dev_local.projectBasePath, '/tmp/publish/build')

  if (fs.existsSync(baseDir) === false) {
    fs.mkdirSync(baseDir, { recursive: true })
  }

  await copyPromise(path.join(config.dev_local.projectBasePath, 'data'), path.join(baseDir, 'data'))

  let files = [
    '.dockerignore',
    'README.md',
    'start-linux.sh',
    'start-mac.sh',
    'start-windows.bat',
  ]

  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    await copyPromise(path.join(__dirname, 'scripts', file), path.join(baseDir, file))
  }
  
  fs.mkdirSync(path.join(baseDir, 'pvc'), { recursive: true})
}

module.exports = prepare