const path = require('path')
const fs = require('fs')
const LoadHelmValues = require('../../lib/LoadHelmValues.js')
const os = require('os')

let SetupDockerRepoTokenDockerhub = async function () {
  let config = await LoadHelmValues()

  // get current token
  let tokenPath = path.join(process.env["HOME"], '/.docker/config.json')
  let currentToken = {}
  if (fs.existsSync(tokenPath)) {
    let currentTokenText = fs.readFileSync(tokenPath, 'utf8')
    currentToken = JSON.parse(currentTokenText)
  }
  
  let originalToken = JSON.parse(JSON.stringify(currentToken))

  //console.log(currentToken)
  if (!currentToken.auths) {
    currentToken.auths = {}
  }

  let changed = false
  if (!currentToken.auths['auths'] || 
      !currentToken.auths['auths']['https://index.docker.io/v1/']) {
    currentToken.auths['https://index.docker.io/v1/'] = {}
    changed = true
  }

  let storeType = 'pass'
  if (os.platform() === 'win32') {
    storeType = 'wincred'
  }

  if (!currentToken.credsStore || 
    currentToken.credsStore !== storeType) {
    currentToken.credsStore = storeType
    changed = true
  }

  // console.log(currentToken)

  if (changed) {
    fs.writeFileSync(tokenPath, JSON.stringify(currentToken, null, 2), 'utf8')
  }
  else {
    originalToken = 'unchanged'
  }

  return originalToken
}

module.exports = SetupDockerRepoTokenDockerhub