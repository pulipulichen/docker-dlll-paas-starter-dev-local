
const BuildYAML = require('./scripts/docker-compose-yaml/BuildYAML.js')
const DockerComposeOperation = require('./scripts/dockerfile/DockerComposeOperation.js')
const DockerComposePublish = require('./scripts/publish/DockerComposePublish.js')

const PublishPrepare = require('./scripts/publish/PublishPrepare.js')
const PublishPackage = require('./scripts/publish/PublishPackage.js')

async function main () {
  await PublishPrepare()
  // await DockerComposePublish()
  await BuildYAML({
    mode: 'publish'
  })
  await PublishPackage()
}

main()