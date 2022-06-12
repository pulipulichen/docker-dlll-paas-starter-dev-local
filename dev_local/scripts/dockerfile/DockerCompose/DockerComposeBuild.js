const { spawn } = require('child_process')
const setupDockerRepoToken = require('../token/SetupDockerRepoToken.js')
const recoverDockerRepoToken = require('../token/RecoverDockerRepoToken.js')

let dockerComposeBuild = async function () {

  let originalToken = await setupDockerRepoToken()
  
  //console.log(1)
  return new Promise(function (resolve, reject) {
    //console.log('before build')
    // console.log('docker-compose', '--file', './tmp/dev_local/yml/docker-compose.yml', "build")
    const child = spawn('docker-compose', ['--file', './tmp/dev_local/yml/docker-compose.yml', "build"]);
    //console.log(2)
    // use child.stdout.setEncoding('utf8'); if you want text chunks
    child.stdout.on('data', (chunk) => {
      // data from standard output is here as buffers
      console.log(chunk.toString());
    });

    // since these are streams, you can pipe them elsewhere
    child.stderr.on('data', async (error) => {
      error = error + ''
      error = error.trim()
      //console.log('ERROR [', error, ']')
      //console.log('aaaa', error, error.endsWith(' uses an image, skipping'))
      if (error.indexOf('failed') > -1) {
        //console.error(error)
        //process.exit();
        //console.error('error', error)
        //console.log('=======================')
        await recoverDockerRepoToken(originalToken)
        reject(error)
      }
      
    });

    child.on('close', async (code) => {
      //console.log(`child process exited with code ${code}`);
      await recoverDockerRepoToken(originalToken)
      resolve(true)
    });
  })
}

module.exports = dockerComposeBuild