const ShellSpawn = require('../../scripts/lib/ShellSpawn.js')
const LoadHelmValues = require('../../scripts/lib/LoadHelmValues.js');

let repo = 45

function formatDate() {
  var date = new Date();
  var YY = date.getFullYear();
  var MM =
  (date.getMonth() + 1 < 10
   ? "0" + (date.getMonth() + 1)
   : date.getMonth() + 1);
  var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hh =
  (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + "";
  var mm =
  (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
  "";
  var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  var SS = date.getMilliseconds() + ''
  while (SS.length < 4) {
    SS = '0' + SS
  } 
  return hh + mm + ss;
}

async function main () {
  let config = await LoadHelmValues()
  //let noexit = (process.argv[2] === 'false')

  let jobs = [
    'start',
    'run-job',
    // 'check-alive'
  ];

  let checkJobs = [
    'check-alive'
  ];

  let cleanJobs = [
    'clean-argocd',
    'clean-quay',
    'clean-git-app',
    'clean-git-argocd',
    'clean-git-repo',
  ];
  
  let cleanAllJobs = [
    // 'clean-all-argocd', // 不能用
    // 'clean-all-git-argocd',
    // 'clean-all-git-repo',
    'clean-all-quey',
  ]

  let defaultCommandTimeout = 4000000
  let headed = '--headless'

  if (process.argv[2] === 'create') {
    // headed = '--headed'
    // Cypress.config('defaultCommandTimeout', 4000)
  }
  if (process.argv[2] === 'clean') {
    jobs = cleanJobs
    defaultCommandTimeout = 40000
    // Cypress.config('defaultCommandTimeout', 4000)
  }
  if (process.argv[2] === 'check') {
    jobs = cleanJobs
    defaultCommandTimeout = 40000
    // Cypress.config('defaultCommandTimeout', 4000)
  }
  if (process.argv[2] === 'clean-all') {
    jobs = cleanAllJobs
    defaultCommandTimeout = 40000
    headed = '--headless'
    // Cypress.config('defaultCommandTimeout', 4000)
  }

  // let runCypress = async function (jobId, TestID, isLast, defaultCommandTimeout) {
  //   await ShellSpawn([`cypress`, `run`, '--env', '--env', `TEST_ID=${TestID + '-' + formatDate()}`, `--headed`, '--no-exit', `--project`, `dev_local`, `--spec`, `dev_local/cypress/integration/${jobs[jobId]}.spec.js`])
  // }

  let dateID = formatDate()

  let run = async (id) => {
    for (let i = 0; i < jobs.length; i++) {
      let job = jobs[i]
      if (job === 'clean-argocd') {
        headed = '--headed'
      }
      else {
        headed = '--headless'
      }
      
      try {
        if (i === jobs.length - 1  && process.argv[2] === 'create' && headed === '--headed' ) {
          await ShellSpawn([`cypress`, `run`, "--config", "defaultCommandTimeout=" + defaultCommandTimeout, '--env', `TEST_ID=${id},DATE_ID=${dateID}`, headed, '--no-exit', `--project`, `dev_local`, `--spec`, `dev_local/cypress/integration/${jobs[i]}.spec.js`])
        }
        else {
          await ShellSpawn([`cypress`, `run`, "--config", "defaultCommandTimeout=" + defaultCommandTimeout, '--env', `TEST_ID=${id},DATE_ID=${dateID}`, headed, `--project`, `dev_local`, `--spec`, `dev_local/cypress/integration/${jobs[i]}.spec.js`])
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  if (process.argv[2] === 'clean-all') {
    repo = 1
  }
  for (let j = 0; j < repo; j++) {
    setTimeout(() => {
      run(j)
    }, 30000 * j)
  }

  // https://patorjk.com/software/taag/#p=display&h=0&v=0&f=ANSI%20Shadow&t=READY%0AFOR%0AIMPORT
  console.log(`

  ███████╗████████╗ █████╗ ██████╗ ████████╗
  ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝
  ███████╗   ██║   ███████║██████╔╝   ██║   
  ╚════██║   ██║   ██╔══██║██╔══██╗   ██║   
  ███████║   ██║   ██║  ██║██║  ██║   ██║   
  ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   

`)
}

main()