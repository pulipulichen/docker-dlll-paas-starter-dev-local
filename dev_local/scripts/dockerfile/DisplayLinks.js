const LoadHelmValues = require('./../lib/LoadHelmValues.js')

let displayLinks = async function () {
  const config = await LoadHelmValues()

  let messages = [
    `App:   http://localhost:${config.environment.app.app.port_dev}/`,
    `Admin: http://localhost:${config.environment.app.admin.port_dev}/`
  ]

  console.log(`==========================================
${messages.join('\n')}
==========================================`)
}

module.exports = displayLinks