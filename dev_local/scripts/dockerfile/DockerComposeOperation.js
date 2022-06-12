// const fs = require('fs');
const path = require('path')
// const { spawn } = require('child_process')
// const LoadHelmValues = require('./LoadHelmValues.js')
const BuildDockerfile = require('./BuildDockerfile.js')
// const ShellSpawn = require('./ShellSpawn.js')

// const runCypress = require('./RunCypress.js')


// const displayLinks = require('./DisplayLinks.js')

const dockerComposePublish = require('../publish/DockerComposePublish.js')

const dockerComposeBuild = require('./DockerCompose/DockerComposeBuild.js')
const dockerComposeUp = require('./DockerCompose/DockerComposeUp.js')
const dockerComposeRemove = require('./DockerCompose/DockerComposeRemove.js')
// const dockerComposeStop = require('./DockerCompose/DockerComposeStop.js')
// const dockerComposeRemove = require('./DockerCompose/DockerComposeRemove.js')

let main = async function (options) {
  await BuildDockerfile()

  //console.log(path.join(__dirname, '../../'))
  process.chdir(path.join(__dirname, '../../../'))

  try {
    if (options.mode === 'build') {
      await dockerComposeRemove()
      await dockerComposeBuild()
      return false
    }
    if (options.mode === 'up') {
      await dockerComposeUp()
      return false
    }
    // if (options.mode === 'publish') {
    //   await dockerComposePublish()
    //   return false
    // }

    if (await dockerComposeBuild()) {
      await dockerComposeUp()
      //await dockerComposeStop()
    }
  }
  catch (e) {
    console.error(e)
  }
}

//main()

module.exports = main