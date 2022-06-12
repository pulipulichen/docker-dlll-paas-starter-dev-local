
describe('Run jobs', () => {

  it('Gitlab', () => {
    cy.visit("https://gitlab.nccu.syntixi.dev/projects/new#import_project").then(() => {
      cy.get('#user_login').type('pudding')
      cy.get('#user_password').type('puddingpudding')
      cy.get('input[type="submit"]').click()
    })

    let projectName
    cy.readFile(`../tmp/cypress/variables_dev${Cypress.env('TEST_ID')}.json`).then(variables => {
      projectName = variables.projectName

      cy.visit(`https://gitlab.nccu.syntixi.dev/pudding/${projectName}/-/blob/main/init-date.txt`).then(() => {
        cy.get('.ide-edit-button').click()
        cy.get('.mtk1').click().type(projectName + ' ' + (new Date() + ''))

        cy.get('[data-testid="begin-commit-button"]').click()

        cy.get('[data-testid="commit-button"] > .gl-button-text').click()

        cy.wait(3000)
        cy.get('#content-body > .page-title').should('contain', 'New merge request')
      })

      // cy.visit(`https://gitlab.nccu.syntixi.dev/pudding/${projectName}/-/pipelines`).then(() => {
      //   cy.get('[data-testid="pipeline-table-row"]:first-of-type .js-ci-status-icon-running', {
      //     timeout: 60 * 200 * 1000
      //   }).should('exist')

      //   cy.get('[data-testid="pipeline-table-row"]:first-of-type .ci-success', {
      //     timeout: 60 * 200 * 1000
      //   }).should('exist')
      // })

    })
  })

})
