
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

      cy.visit(`https://gitlab.nccu.syntixi.dev/pudding/${projectName}/edit`).then(() => {
        cy.get('#js-project-advanced-settings > .settings-header > .btn').click()
        
        cy.get('form > .btn > .gl-button-text:contains(Delete project)').click()

        cy.wait(1000)

        cy.get('code.gl-white-space-pre-wrap').then(($ele) => {

          // store the button's text
          const txt = $ele.text()
        
          // submit a form
          cy.get('#delete-project-modal-2 #confirm_name_input').type(txt)
          cy.get('.js-modal-action-primary > .gl-button-text').click()

          cy.url().should('eq', 'https://gitlab.nccu.syntixi.dev/dashboard/projects')
        })
      })
      

    })
  })

})
