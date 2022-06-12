
describe('Admin test', () => {

  it('Before test - variables clean', () => {
    cy.writeFile("../tmp/cypress/variables.json", {})
  })

  it('Admin pages should have URL', () => {
    cy.visit(Cypress.env('ADMIN_URL'))

    cy.get(`.ui.cards a.ui.card`)
      .then(cards => {

        let urlMap = {}
        for (let i = 0; i < cards.length; i++) {
          let card = cards[i]
          urlMap[card.target] = card.href
        }

        // cy.wrap(urlMap.app).should('equal', "AAA") // for degub
        cy.wrap(urlMap.app).should('equal', Cypress.env('APP_URL'))
        cy.writeFile("../tmp/cypress/variables.json", urlMap)

      })

  })
 
})
