const { spawn } = require('child_process')

let dockerComposeStop = async function () {
  //console.log(1)
  return new Promise(function (resolve, reject) {
    const child = spawn('docker-compose', ['--file', './tmp/dev_local/yml/docker-compose.yml', "stop"]);
    //console.log(2)
    // use child.stdout.setEncoding('utf8'); if you want text chunks
    child.stdout.on('data', (chunk) => {
      // data from standard output is here as buffers
      console.log(chunk.toString());
    });

    // since these are streams, you can pipe them elsewhere
    child.stderr.on('data', (error) => {
      console.log(error.toString())
    });


    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(true)
    });
  })
}

module.exports = dockerComposeStop