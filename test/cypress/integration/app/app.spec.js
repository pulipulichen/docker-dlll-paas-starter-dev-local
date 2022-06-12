describe('APP Test', () => {
  //return false

  it(`The APP should finish loading` , () => {
    
    cy.readFile("../tmp/cypress/variables.json").then(variables => {
      cy.visit(variables.app, {
        failOnStatusCode: false
      })
    })

    cy.get('b:contains(Warning)').should('not.exist')
    
    cy.get('#finish').should('be.visible')
  })
})
   