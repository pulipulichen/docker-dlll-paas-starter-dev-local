
describe('Clean project', () => {

  it('Gitlab', () => {
    cy.visit("https://gitlab.nccu.syntixi.dev/projects/new#import_project").then(() => {
      cy.get('#user_login').type('pudding')
      cy.get('#user_password').type('puddingpudding')
      cy.get('input[type="submit"]').click()
    })

    
    let doRemove = function () {
      cy.visit(`https://gitlab.nccu.syntixi.dev/deploybot/argocd/-/branches/all`).then(() => {
        cy.get('.content-list .branch-item .item-title').then(($names) => {
          
          let name
          let matched = false
          for (let i = 0; i < $names.length; i++) {
            name = $names.eq(i).text().trim()
            if (name.startsWith('test-') || 
                name.startsWith('testa') ||
                name.startsWith('test0')) {
              matched = true
              break
            }
          }
          // let name = names[0]
          if (matched === false) {

            return true
          }

          cy.get(`.all-branches li[data-name="${name}"] button[title="Delete branch"]`).click()

          cy.wait(1000)

          cy.get('#delete-branch-modal button[data-qa-selector="delete_branch_confirmation_button"]').click()

          cy.wait(1000)

          cy.get(`#content-body`).should('exist');
          doRemove()
        })
      })
    }
    doRemove()
  })

})
