
describe('Clean project', () => {

  it('Gitlab', () => {

    cy.visit(`https://quay.nccu.syntixi.dev/signin/`).then(() => {
      cy.get(`#signin-username`).type('pudding')
      cy.get(`#signin-password`).type('puddingpudding')

      // cy.wait(500)
      cy.get(`[type="submit"][quay-show="Features.DIRECT_LOGIN"]`).click()

      cy.get(`h2.co-nav-title-content.co-fx-text-shadow span:contains(Repositories)`).should('exist')
    })

    let doRemove = function () {
      cy.visit(`https://quay.nccu.syntixi.dev/repository/`).then(() => {
        cy.wait(1000)
        cy.get('.co-table .repo-name-icon .name').then(($names) => {
          
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

          let projectName = name

          cy.visit(`https://quay.nccu.syntixi.dev/repository/dlll/${projectName}?tab=settings`).then(() => {
            cy.get('.btn.btn-danger.delete-btn').click()
            cy.wait(1000)
            cy.get('.cor-confirm-dialog input[placeholder="Enter repository here"]').type(`dlll/${projectName}`)
            cy.get('.cor-confirm-dialog .modal-footer .btn.btn-primary.btn-danger').click()

            cy.get(`h2.co-nav-title-content.co-fx-text-shadow span:contains(Repositories)`).should('exist')

            doRemove()
          })
          
        })
      })
    }
    doRemove()
  })

})
