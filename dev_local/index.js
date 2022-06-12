
const BuildYAML = require('./scripts/docker-compose-yaml/BuildYAML.js')
const DockerComposeOperation = require('./scripts/dockerfile/DockerComposeOperation.js')

async function main () {
  let mode = process.argv[2]

  await BuildYAML({
    mode
  })

  await DockerComposeOperation({
    mode
  })
}

main()