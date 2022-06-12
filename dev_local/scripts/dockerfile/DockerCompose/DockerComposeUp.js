const { spawn } = require('child_process')

const runCypress = require('./../RunCypress.js')
const displayLinks = require('./../DisplayLinks.js')

const dockerComposeStop = require('./DockerComposeStop.js')
const dockerComposeRemove = require('./DockerComposeRemove.js')

let dockerComposeUp = async function () {
  //return console.log('UP')

  return new Promise(function (resolve, reject) {
    const child = spawn('docker-compose', ['--file', './tmp/dev_local/yml/docker-compose.yml', "up", "--remove-orphans"]);

    /*
    const shell = spawn('docker-compose', ['--file', './tmp/dev_local/yml/docker-compose.yml', "run", 'app', 'bash'], { stdio: 'inherit' })
    shell.on('close', async (code) => { 
      console.log('[shell] terminated :',code)
      //child.stdin.pause()
      await dockerComposeStop()
      await dockerComposeRemove()
      process.exit()
      resolve(true)
    })
    */
    // use child.stdout.setEncoding('utf8'); if you want text chunks

    child.stdout.on('data', (chunk) => {
      let message = chunk.toString()
      console.log(message);
    });

    let hasRun = false
    // since these are streams, you can pipe them elsewhere
    child.stderr.on('data', (chunk) => {
      let message = chunk.toString()
      // data from standard output is here as buffers
      console.log(message);
      // Command line: 'apache2 -D FOREGROUND'
      let appName = `yml_app_1`
      if (hasRun === false && 
          (message.startsWith(`Creating ${appName}`) ||
            message.startsWith(`Recreating ${appName}`) || 
            message.startsWith(`${appName} is up-to-date`) ) ) {
        hasRun = true
        
        setTimeout(async () => {
          runCypress()
          await displayLinks()
        }, 1000)
      }
    });

    child.on('close', async (code) => {
      console.log(`child process exited with code ${code}`);
      
      resolve(true)
    });

    process.on('SIGINT', async function() {
      console.log("Caught interrupt signal");
      await dockerComposeStop()
      await dockerComposeRemove()
      process.exit()
      resolve(true)
    });
  })
}

module.exports = dockerComposeUp