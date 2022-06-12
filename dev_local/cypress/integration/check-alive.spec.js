
describe('Check alive', () => {

  it('check', () => {
    let projectName
    cy.readFile(`../tmp/cypress/variables_dev${Cypress.env('TEST_ID')}.json`).then(variables => {
      projectName = variables.projectName

      // cy.visit(`https://argocd.nccu.syntixi.dev/applications/deploybot-${projectName}-pudding?view=tree&resource=`).then(() => {
      //   cy.get('.application-status-panel__item-value [qe-id="utils-health-status-title"][title="Healthy"]').should('exist')
      // })

      cy.visit(`http://${projectName}.pudding.paas.dlll.pulipuli.info`).then(() => {
        cy.get('h1').should('exist')
      })
    })
  })
})
