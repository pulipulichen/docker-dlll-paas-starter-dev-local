const fs = require('fs-extra');

async function copyPromise (from, to) {
  //console.log({from, to})
  return new Promise(function (resolve, reject) {
    fs.copy(from, to, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

module.exports = copyPromise