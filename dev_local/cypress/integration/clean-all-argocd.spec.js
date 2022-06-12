
describe('Clean project', () => {

  it('Gitlab', () => {

    cy.visit(`https://argocd.nccu.syntixi.dev/login`).then(() => {
      // cy.wait(3000)

      cy.get('form .argo-form-row:first-of-type input').type("admin")
      cy.get('form .argo-form-row:nth(1) input').type("hvk5CfCjqwVH4SYk")
      
      cy.get('button[type="submit"]').click()

      cy.get('.top-bar__breadcrumbs-last-item').should('exist')
    })

    let doRemove = function () {
      cy.visit(`https://argocd.nccu.syntixi.dev/applications?proj=&sync=&health=&namespace=&cluster=&labels=`).then(() => {
        cy.wait(1000)
        cy.get('.column-block .applications-list__info .row .applications-list__title').then(($names) => {
          
          let name
          let matched = false
          let anchor
          for (let i = 0; i < $names.length; i++) {
            name = $names.eq(i).text().trim()
            if (name.startsWith('deploybot-test-') && 
                name.endsWith('-pudding')) {
              matched = true
              anchor = $names.eq(i)
              cy.log(name)
              break
            }
          }
          // let name = names[0]
          if (matched === false) {
            return true
          }

          let block = anchor.parents('.column-block:first')
          let button = block.find('a[qe-id="applications-tiles-button-delete"]')

          cy.wrap(button).click()

          cy.wait(1000)
          cy.window().trigger('focus')
          cy.document().trigger('focus')
          cy.get('.popup-overlay .argo-label-placeholder').click()
          // cy.wait(1000)
          // cy.get('.popup-overlay .argo-form-row input').click().focus()
          // // cy.wait(100)
          // cy.get('.popup-overlay').click()
          // cy.wait(1000)
          // cy.get('.popup-overlay [qeid="name-field-delete-confirmation"]').click()
          // cy.wait(500)

          // cy.get('.popup-overlay [qeid="name-field-delete-confirmation"]').invoke('attr', 'value', name).type('{end}')
          // // .type(name, {delay: 0, force: true})

          // // cy.log(name)
          // // cy.get('.popup-overlay [qeid="name-field-delete-confirmation"]').clear().type(name)
  
          // cy.wait(1000)
          // cy.get('button[qe-id="prompt-popup-ok-button"]').click()
          // cy.wait(1000)
          cy.get('.popup-overlay .argo-label-placeholder').click()
          cy.wait(1000)
          cy.get('.popup-overlay [qeid="name-field-delete-confirmation"]').clear().type(name + '{enter}')
          // cy.get('.popup-overlay [qeid="name-field-delete-confirmation"]').type(name, {delay: 0, force: true, parseSpecialCharSequences: false})
          // cy.get('.popup-overlay [qeid="name-field-delete-confirmation"]').invoke('attr', 'value', name).type('{enter}')
          // cy.wait(1000)
          // cy.get('button[qe-id="prompt-popup-ok-button"]').click()

          // cy.get('.popup-overlay [qeid="name-field-delete-confirmation"]').invoke('attr', 'value', name).type('{enter}')
          // cy.get('button[qe-id="prompt-popup-ok-button"]').click()
  
          // cy.get('.application-details__status-panel i[qe-id="utils-health-status-title"][title="Missing"]').should('exist')
          cy.wait(1000)
          
        })
      })
    }
    doRemove()
  })

})
