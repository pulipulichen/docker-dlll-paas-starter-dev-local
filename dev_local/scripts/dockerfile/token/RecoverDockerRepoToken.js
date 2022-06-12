const fs = require('fs');
const path = require('path');

let recoverDockerRepoToken = async function (originalToken) {
  // console.log({originalToken})
  // get current token
  if (!originalToken) {
    throw new Error(originalToken)
    return false
  }
  else if (originalToken === 'unchanged') {
    return false
  }

  let tokenPath = path.join(process.env["HOME"], '/.docker/config.json')
  fs.writeFileSync(tokenPath, JSON.stringify(originalToken, null, 2), 'utf8')
}

module.exports = recoverDockerRepoToken