
describe('Clean project', () => {

  it('quay', () => {

    let projectName
    cy.readFile(`../tmp/cypress/variables_dev${Cypress.env('TEST_ID')}.json`).then(variables => {
      projectName = variables.projectName

      cy.visit(`https://quay.nccu.syntixi.dev/signin/`).then(() => {
        cy.get(`#signin-username`).type('pudding')
        cy.get(`#signin-password`).type('puddingpudding')

        // cy.wait(500)
        cy.get(`[type="submit"][quay-show="Features.DIRECT_LOGIN"]`).click()

        cy.get(`h2.co-nav-title-content.co-fx-text-shadow span:contains(Repositories)`).should('exist')
      })

      cy.visit(`https://quay.nccu.syntixi.dev/repository/dlll/${projectName}-pudding?tab=settings`).then(() => {
        cy.get('.btn.btn-danger.delete-btn').click()
        cy.wait(1000)
        cy.get('.cor-confirm-dialog input[placeholder="Enter repository here"]').type(`dlll/${projectName}-pudding`)
        cy.get('.cor-confirm-dialog .modal-footer .btn.btn-primary.btn-danger').click()

        cy.get(`h2.co-nav-title-content.co-fx-text-shadow span:contains(Repositories)`).should('exist')
      })
    })
  })

})
