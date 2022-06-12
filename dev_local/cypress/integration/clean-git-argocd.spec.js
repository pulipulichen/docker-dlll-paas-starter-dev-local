
describe('Clean project', () => {

  it('Gitlab', () => {
    cy.visit("https://gitlab.nccu.syntixi.dev/projects/new#import_project").then(() => {
      cy.get('#user_login').type('pudding')
      cy.get('#user_password').type('puddingpudding')
      cy.get('input[type="submit"]').click()
    })

    let projectName
    cy.readFile(`../tmp/cypress/variables_dev${Cypress.env('TEST_ID')}.json`).then(variables => {
      projectName = variables.projectName

      cy.visit(`https://gitlab.nccu.syntixi.dev/deploybot/argocd/-/branches/all`).then(() => {
        cy.get(`.all-branches li[data-name="${projectName}-pudding"] button[title="Delete branch"]`, {
          timeout: 2000
        }).click()

        cy.wait(1000)

        cy.get('#delete-branch-modal button[data-qa-selector="delete_branch_confirmation_button"]').click()

        cy.wait(1000)

        cy.get(`#content-body`).should('exist');
      })

    })
  })

})
