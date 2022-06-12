
describe('Data test', () => {
  //return false

  it('Data can login', () => {
    cy.readFile("../tmp/cypress/variables.json").then(variables => {
      cy.visit(variables.data, {
        failOnStatusCode: false
      })
    })

    cy.get('input[placeholder="Username"]').type(Cypress.env('values').auth.username)
    cy.get('input[placeholder="Password"]').type(Cypress.env('values').auth.password)
    
    cy.get('input[type="submit"]').click()
    
    cy.get('#listing div[role="button"].item').should('be.visible')
  })

})
