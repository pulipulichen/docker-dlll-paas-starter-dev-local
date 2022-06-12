const path = require('path')
const fs = require('fs')
const LoadHelmValues = require('./../../lib/LoadHelmValues.js')

let setupDockerRepoToken = async function () {
  let config = await LoadHelmValues()

  // get current token
  let tokenPath = path.join(process.env["HOME"], '/.docker/config.json')
  let currentToken = {}
  if (fs.existsSync(tokenPath)) {
    let currentTokenText = fs.readFileSync(tokenPath, 'utf8')
    currentToken = JSON.parse(currentTokenText)

    // console.log({currentToken})
  }
  
  let originalToken = JSON.parse(JSON.stringify(currentToken))
  // console.log({originalToken})
  //console.log(currentToken)
  if (!currentToken.auths) {
    currentToken.auths = {}
  }

  let quay_auth_host = config.environment.build.quay_auth_host
  let quay_auth_token = config.environment.build.quay_auth_token
  if (!currentToken.auths) {
    currentToken.auths = {}
  }

  let changed = false
  if (!currentToken.auths[quay_auth_host]) {
    currentToken.auths[quay_auth_host] = {
      "auth": quay_auth_token,
      "email": ""
    }

    changed = true

    // fs.writeFileSync(tokenPath, JSON.stringify(currentToken, null, 2), 'utf8')
  }

  if (currentToken.credsStore) {
    delete currentToken.credsStore
    changed = true
  }

  if (changed) {
    fs.writeFileSync(tokenPath, JSON.stringify(currentToken, null, 2), 'utf8')
  }
  else {
    originalToken = 'unchanged'
  }

  return originalToken
}

module.exports = setupDockerRepoToken