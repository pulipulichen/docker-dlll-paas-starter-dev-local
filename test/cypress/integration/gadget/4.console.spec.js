
describe('Console test', () => {

  it('Console can connect to APP via SSH', () => {
    cy.readFile("../tmp/cypress/variables.json").then(variables => {

      cy.visit(variables.console, {
        failOnStatusCode: false
      })
        
    })

    cy.get('#username').type(Cypress.env('values').app.Dockerfile.USER)
    cy.get('#password').type(Cypress.env('values').auth.password)

    cy.get('button[type="submit"]').click()
    
    cy.get('canvas.xterm-cursor-layer').should('be.visible')
  })
})
