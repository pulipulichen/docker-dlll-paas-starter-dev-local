const { spawn } = require('child_process')

let runCypress = async function () {
  //console.log(1)
  return new Promise(function (resolve, reject) {
    const child = spawn('npm', ["run", "test"]);
    //console.log(2)
    // use child.stdout.setEncoding('utf8'); if you want text chunks
    child.stdout.on('data', (chunk) => {
      // data from standard output is here as buffers
      console.log(chunk.toString());
    });

    // since these are streams, you can pipe them elsewhere
    child.stderr.on('error', (error) => {
      error = error.toString().trim()
      //console.log('aaaa', error, error.endsWith(' uses an image, skipping'))
      if (!error.endsWith(' uses an image, skipping')) {
        //console.error(error)
        //process.exit();
      }
    });

    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(true)
    });
  })
}

module.exports = runCypress