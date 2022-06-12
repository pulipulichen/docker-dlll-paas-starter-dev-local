
describe('Clean project', () => {

  it('Gitlab', () => {
    cy.visit("https://gitlab.nccu.syntixi.dev/projects/new#import_project").then(() => {
      cy.get('#user_login').type('pudding')
      cy.get('#user_password').type('puddingpudding')
      cy.get('input[type="submit"]').click()
    })

    
    let doRemoveRepot = function () {
      cy.visit(`https://gitlab.nccu.syntixi.dev/dashboard/projects`).then(() => {
        cy.wait(1000)
        cy.get('.projects-list .no-description .project-full-name .project-name').then(($names) => {
          if ($names.length === 0) {
            return true
          }
          let name = $names.eq(0).text()
          // let name = names[0]
          if (!name.startsWith('test-') && 
              !name.startsWith('testa') && 
              !name.startsWith('test0')) {
            return true
          }

          cy.visit(`https://gitlab.nccu.syntixi.dev/pudding/${name}/edit`).then(() => {
            
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
              // cy.visit(`https://gitlab.nccu.syntixi.dev/dashboard/projects/starred`)
              doRemoveRepot()
            })
          })
        })
      })
    }
    doRemoveRepot()
  })

})
