const fs = require('fs');
const path = require('path');

const LoadHelmValues = require('../lib/LoadHelmValues');

var zip = require('cross-zip')
var rimraf = require("rimraf");

function yyyymmdd(dateIn) {
  if (!dateIn) {
    dateIn = new Date()
  }

  var yyyy = dateIn.getFullYear();
  var mm = dateIn.getMonth() + 1; // getMonth() is zero-based
  var dd = dateIn.getDate();
  return String(10000 * yyyy + 100 * mm + dd); // Leading zeros for mm and dd
}

async function package () {
  let config = await LoadHelmValues()

  let baseDir = path.join(config.dev_local.projectBasePath, '/tmp/publish/build')
  let basename = config.deploy.tag_prefix
  let baseDirRename = path.join(baseDir, '../' + basename)

  // console.log({baseDirRename})
  if (fs.existsSync(baseDirRename)) {
    console.log('準備移除')
    // rimraf(baseDirRename, () => {})
    fs.rmSync(baseDirRename, { recursive: true, force: true})
    if (fs.existsSync(baseDirRename)) {
      throw new Error('Dir is still there: ' + baseDirRename)
    }
    console.log('移除完成')
  }
  fs.renameSync(baseDir, baseDirRename)

  let filename = basename  + '_' + yyyymmdd() + '.zip'
  let publishPacakge =  path.join(config.dev_local.projectBasePath, 'publish/' + filename)

  // console.log('準備ZIP')
  zip.zipSync(baseDirRename, publishPacakge)
  // console.log('準備ZIP結束')
  // rimraf(baseDirRename, () => {})
  fs.rmSync(baseDirRename, { recursive: true, force: true})

  console.log(`

  ███████╗██╗███╗   ██╗██╗███████╗██╗  ██╗
  ██╔════╝██║████╗  ██║██║██╔════╝██║  ██║
  █████╗  ██║██╔██╗ ██║██║███████╗███████║
  ██╔══╝  ██║██║╚██╗██║██║╚════██║██╔══██║
  ██║     ██║██║ ╚████║██║███████║██║  ██║
  ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝╚══════╝╚═╝  ╚═╝

Check out your publish package: 
${publishPacakge}
`)
}

module.exports = package