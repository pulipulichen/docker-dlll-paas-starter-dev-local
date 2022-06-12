let url = 'https://gitlab.nccu.syntixi.dev/pudding/dlll-paas-starter.git'
// let url = 'https://gitlab.nccu.syntixi.dev/pudding/dlll-paas-starter-for-text-20220602-1928.git'
    
describe('Create project', () => {

    
  it('gitlab', () => {

    let projectName = 'test' + '-' + Cypress.env('TEST_ID') + '-' + Cypress.env('DATE_ID')
    
    // cy.log(Cypress.env('TEST_ID'))
    // return

    it('Before test - variables clean', () => {
      cy.writeFile("../tmp/cypress/variables_dev.json", {})
    })

    cy.visit("https://gitlab.nccu.syntixi.dev/projects/new#import_project").then(() => {
      cy.get('#user_login').type('pudding')
      cy.get('#user_password').type('puddingpudding')
      cy.get('input[type="submit"]').click()

      cy.get(`.js-import-git-toggle-button`).click()
    })

    
    cy.get('#project_import_url').type(url).then(() => {
      cy.get('#project_import_url_user').type('pudding')
      cy.get('#project_import_url_password').type('puddingpudding')

      cy.wait(1000)

      cy.writeFile(`../tmp/cypress/variables_dev${Cypress.env('TEST_ID')}.json`, {
        projectName
      })

      cy.get('#project_name').clear().type(projectName)

      cy.get('.js-toggle-content > #new_project > .visibility-level-setting > :nth-child(2) > #project_visibility_level_10:visible').click()

      cy.wait(1000)

      cy.get('.js-toggle-content > #new_project > .btn-confirm:visible').click()

      cy.get('.home-panel-title').should('contain', projectName)

    })


    cy.visit(`https://gitlab.nccu.syntixi.dev/pudding/${projectName}/edit`).then(() => {
      cy.get('#js-shared-permissions > .settings-header > .btn').click()
      
      cy.get('#js-shared-permissions .js-emails-disabled input[type="checkbox"]').click()

      cy.get('#js-shared-permissions input[type="submit"]').click()
    })
  })
})
