const ShellSpawn = require('../../dev_local/scripts/lib/ShellSpawn.js')
const LoadHelmValues = require('./../../dev_local/scripts/lib/LoadHelmValues.js')

async function main () {
  let config = await LoadHelmValues()
  let noexit = (process.argv[2] === 'false')

  let headed = '--headed'
  headed = '--headless'

  // await ShellSpawn([`cypress`, `run`, headed, `--project`, `test`, `--spec`, `test/cypress/integration/gadget/admin.spec.js`])
  await ShellSpawn([`cypress`, `run`, headed, `--project`, `test`, `--spec`, `test/cypress/integration/gadget/**/*`])
  if (noexit) {
    await ShellSpawn([`cypress`, `run`, headed, '--no-exit', `--project`, `test`, `--spec`, `test/cypress/integration/app/**/*`])
  }
  else {
    await ShellSpawn([`cypress`, `run`, headed, `--project`, `test`, `--spec`, `test/cypress/integration/app/**/*`])
  }
  
  // await ShellSpawn([`cypress`, `run`, `--headed`, '--no-exit', `--project`, `test`, `--spec`, `test/cypress/integration/gadget/database.spec.js`])


  // https://patorjk.com/software/taag/#p=display&h=0&v=0&f=ANSI%20Shadow&t=READY%0AFOR%0AIMPORT
  console.log(`

███████╗██╗███╗   ██╗██╗███████╗██╗  ██╗
██╔════╝██║████╗  ██║██║██╔════╝██║  ██║
█████╗  ██║██╔██╗ ██║██║███████╗███████║
██╔══╝  ██║██║╚██╗██║██║╚════██║██╔══██║
██║     ██║██║ ╚████║██║███████║██║  ██║
╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝╚══════╝╚═╝  ╚═╝

Checkout your awesome application:
APP:   http://localhost:${config.environment.app.app.port_dev}/
ADMIN: http://localhost:${config.environment.app.admin.port_dev}/
`)
}

main()