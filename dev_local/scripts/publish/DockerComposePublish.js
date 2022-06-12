const LoadHelmValues = require('../lib/LoadHelmValues.js')
const setupDockerRepoToken = require('../dockerfile/token/SetupDockerRepoToken.js')
const SetupDockerRepoTokenDockerhub = require('../dockerfile/token/SetupDockerRepoTokenDockerhub.js')
const recoverDockerRepoToken = require('../dockerfile/token/RecoverDockerRepoToken.js')
const ShellSpawn = require('../lib/ShellSpawn.js')

let dockerComposePublish = async function () {
  let config = await LoadHelmValues()
  process.chdir(config.dev_local.projectBasePath)

  let publish_dockerhub = config.deploy.publish_dockerhub

  let repo = publish_dockerhub
  if (repo.indexOf(':')) {
    repo = repo.slice(0, repo.indexOf(':'))
  }
  let tag = 'latest'
  if (publish_dockerhub.indexOf(':')) {
    tag = tag.slice(tag.indexOf(':') + 1)
  }

  let originalToken = await setupDockerRepoToken()
  // console.log(originalToken)
  await ShellSpawn([`docker`, `build`, `-t`, publish_dockerhub, `.`, '-f', './tmp/dev_local/yml/Dockerfile'])
  
  await recoverDockerRepoToken(originalToken)

  originalToken = await SetupDockerRepoTokenDockerhub()
  
  await ShellSpawn([`docker`, `push`, publish_dockerhub])

  await recoverDockerRepoToken(originalToken)

  // https://hub.docker.com/repository/docker/pudding/dlll-paas-base-image
  console.log(`=================================
Publish to https://hub.docker.com/repository/docker/${repo}

You can pull the image in Dockerfile with following command:

FROM ${publish_dockerhub}`)
}

module.exports = dockerComposePublish