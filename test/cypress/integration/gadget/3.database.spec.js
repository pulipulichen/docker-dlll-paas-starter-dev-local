
describe('Databases test', () => {
  // return false

  let enabled_drivers = Cypress.env('values').database.enabled_drivers
  let {username, password} = Cypress.env('values').auth
  let databaseName = Cypress.env('values').database.database_name
  it('MySQL should work', () => {
    // return false
    if (!enabled_drivers || enabled_drivers.indexOf('mysql') === -1) {
      cy.log('MySQL is disabled')
      return false
    }


    cy.readFile("../tmp/cypress/variables.json").then(variables => {
      cy.visit(variables.mysql, {
        failOnStatusCode: false
      })
    })

    // cy.log(Cypress.env('values'))
    cy.get('#input_username').type(username)
    cy.get('#input_password').type(password)

    cy.get('[type="submit"]').click()
    
    cy.get('#pma_navigation_tree_content ul li a').contains(databaseName).should('exist')
  })

  it('SQLite should work', () => {
    // return false
    if (!enabled_drivers || enabled_drivers.indexOf('sqlite') === -1) {
      cy.log('SQLite is disabled')
      return false
    }

    cy.readFile("../tmp/cypress/variables.json").then(variables => {
      cy.visit(variables.sqlite, {
        failOnStatusCode: false
      })
    })

    cy.get('[name="password"]').type(password)

    cy.get('[type="submit"]').click()
    
    cy.get('.active_db').contains(`/db/${databaseName}.sqlite`).should('exist')
  })

  it('MongoDB should work', () => {
    // return false
    if (!enabled_drivers || enabled_drivers.indexOf('mongo') === -1) {
      cy.log('MongoDB is disabled')
      return false
    }

    cy.readFile("../tmp/cypress/variables.json").then(variables => {
      cy.visit(variables.mongo, {
        auth: {
          username: username,
          password: password
        },
        failOnStatusCode: false
      })
    })

    // cy.log(Cypress.env('values'))
    cy.wait(5000)
    cy.get(`h3 a[href="/db/admin/"]`, {timeout: 10000}).should('exist')
    //cy.get(`h3 a[href="/db/${databaseName}/"]`, {timeout: 10000}).should('exist')
  })

  it('PostgreSQL should work', () => {
    
    if (!enabled_drivers || enabled_drivers.indexOf('pgsql') === -1) {
      cy.log('PostgreSQL is disabled')
      return false
    }

    cy.readFile("../tmp/cypress/variables.json").then(variables => {
      cy.visit(variables.pgsql, {
        failOnStatusCode: false
      })
    })

    // let iframe = cy.getIframe('#detail')
    cy.getIframe('#detail').find('a[href="servers.php"]').click()

    cy.wait(2000)
    cy.getIframe('#detail').find('.data1 td a[href]', {timeout: 10000}).click()

    // cy.log(Cypress.env('values'))
    cy.wait(2000)
    cy.getIframe('#detail').find('[name="loginUsername"]', {timeout: 10000}).type(username)
    cy.getIframe('#detail').find('#loginPassword').type(password)

    cy.getIframe('#detail').find('[type="submit"]').click()
    
    cy.wait(2000)
    cy.getIframe('#detail').find(`.data1 td a[href$="&database=${databaseName}&"]`, {timeout: 10000}).should('exist')
  })

  it('Neo4j should work', () => {
    if (!enabled_drivers || enabled_drivers.indexOf('neo4j') === -1) {
      cy.log('Neo4j is disabled')
      return false
    }

    cy.readFile("../tmp/cypress/variables.json").then(variables => {
      cy.visit(variables.neo4j, {
        failOnStatusCode: false
      })
    })

    // cy.log(Cypress.env('values'))
    cy.get('input[data-testid="username"]').clear().type('neo4j')
    cy.get('input[data-testid="password"]').type(password)

    cy.get('[type="submit"]').click()
    // cy.wait(5000)
    // cy.get('h3').contains('Connect to Neo4j').should('not.exist')
    // cy.get('div[data-testid="activeEditor"]').should('exist')
    cy.get('label[data-testid="frameCommand"] span:contains(:play start)').should('exist')
  })
})
