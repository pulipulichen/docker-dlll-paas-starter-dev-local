
describe('Clean project', () => {

  it('ArgoCD', () => {

    let projectName
    cy.readFile(`../tmp/cypress/variables_dev${Cypress.env('TEST_ID')}.json`).then(variables => {
      projectName = variables.projectName

      cy.visit(`https://argocd.nccu.syntixi.dev/applications/deploybot-${projectName}-pudding?resource=`).then(() => {
        cy.get('form .argo-form-row:first-of-type input').type("admin")
        cy.get('form .argo-form-row:nth(1) input').type("hvk5CfCjqwVH4SYk")
        
        cy.get('button[type="submit"]').click()
      })
        

      cy.get('.top-bar.row i.fa.fa-times-circle', {
        timeout: 4000
      }).click().then(() => {
        cy.wait(1000)
        cy.window().trigger('focus')
        cy.document().trigger('focus')
        cy.get('.popup-overlay .argo-label-placeholder').click()
        cy.wait(1000)
        cy.get('.popup-overlay .argo-form-row input').click().focus()
        // cy.wait(100)
        cy.get('.popup-overlay').click()

        cy.get('.popup-overlay .argo-form-row input').type(`deploybot-${projectName}-pudding`)

        cy.get('button[qe-id="prompt-popup-ok-button"]').click()

        cy.get('.application-details__status-panel i[qe-id="utils-health-status-title"][title="Missing"]').should('exist')
      })
    })
  })

})
