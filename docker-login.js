const fs = require('fs')
const path = require('path')

const {DOCKERHUB_AUTH} = process.env

if (DOCKERHUB_AUTH) {
  let content = `{
    "auths": {
            "https://index.docker.io/v1/": {
                    "auth": "${DOCKERHUB_AUTH}"
            }
    }
  }`

  fs.mkdirSync(path.join(process.env["HOME"], '/.docker/'), { recursive: true})
  let tokenPath = path.join(process.env["HOME"], '/.docker/config.json')
  fs.writeFileSync(tokenPath, content, 'utf8')
}