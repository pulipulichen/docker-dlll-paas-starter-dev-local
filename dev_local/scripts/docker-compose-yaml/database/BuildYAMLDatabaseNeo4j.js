/**
 * https://neo4j.com/developer/kb/import-csv-locations/
 * LOAD CSV WITH HEADERS FROM 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSx5-mHPUs7hQ3292zrLL_FeNzo85iC83TiezRcPl_SUv4NpW0e2VZilCUH9KbCWExAfE7OAELgdCW8/pub?gid=0&single=true&output=csv' AS row
RETURN row

https://neo4j.com/docs/getting-started/current/cypher-intro/load-csv/

https://neo4j.com/docs/cypher-manual/current/clauses/load-csv/#load-csv-import-data-from-a-remote-csv-file
LOAD CSV FROM 'http://data.neo4j.com/bands/artists.csv' AS line CREATE (:Artist {name: line[1],
  year: toInteger(line[2])})

LOAD CSV WITH HEADERS FROM 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_6dl1zGUC6enPKOQ5r-o7n5VksKT-sxI3l6J_187ionJGa3umD2oLlj5TormvUTmrrE5J_UuL18PY/pub?gid=1459894099&single=true&output=csv' AS line
CREATE (:Movie {movieId: toInteger(line.id), title: line.title, country: line.country, year: toInteger(line.Year)})

LOAD CSV WITH HEADERS FROM 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_LIIn3cqBpV3X-fKgXTP43txe80zgTXF0IkereGRcGGUCAzR7vWW4OE_qaqg5Z2rGglZfo2koTVjx/pub?gid=1010786075&single=true&output=csv' AS line
CREATE (:Person {personId: toInteger(line.id), name: line.name})

LOAD CSV WITH HEADERS FROM 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2oOmAA5t6VmtL5t48OFLj4rgb4-JX86-804Kj3ng-r5e7R2GccuIeqxsyCX5_z-Ne_BN_yGScbHWn/pub?gid=390287731&single=true&output=csv' AS line
CREATE (:Role {personId: toInteger(line.persondId), movieId: toInteger(line.movieId), role: line.role)

  全部清空
MATCH (n)
DETACH DELETE n

https://neo4j.com/graphgists/importing-csv-files-with-cypher/

MATCH (n)
DETACH DELETE n;

LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/neo4j/neo4j/2.3/manual/cypher/cypher-docs/src/docs/graphgists/import/persons.csv" AS csvLine
CREATE (p:Person {id: toInteger(csvLine.id), name: csvLine.name});

LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/neo4j/neo4j/2.3/manual/cypher/cypher-docs/src/docs/graphgists/import/movies.csv" AS csvLine
MERGE (country:Country {name: csvLine.country})
CREATE (movie:Movie {id: toInteger(csvLine.id), title: csvLine.title, year:toInteger(csvLine.year)})
CREATE (movie)-[:MADE_IN]->(country);

LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/neo4j/neo4j/2.3/manual/cypher/cypher-docs/src/docs/graphgists/import/roles.csv" AS csvLine
MATCH (person:Person { id: toInteger(csvLine.personId)}),(movie:Movie { id: toInteger(csvLine.movieId)})
CREATE (person)-[:PLAYED { role: csvLine.role }]->(movie);

MATCH (n) WHERE n:Person OR n:Movie RETURN n;

 */

const moduleName = 'neo4j'

// ---------------------------------------------------

const YAMLUtils = require('./../YAMLUtils.js')
const path = require('path')

function setupDB(ymlJSON, config) {
  
  let {image, port_admin, port_api, data_path, port_dev, env} = config.environment.database[moduleName] 

  let service = {
    image,
    environment: {
      NEO4J_AUTH: 'neo4j/' + config.auth.password
    },
    ports: [
      port_dev + ':' + port_admin,
      port_api + ':' + port_api // 內部運作需要
    ],
    logging: { driver: 'none' },
    hostname: 'database-' + moduleName + '.dev-local',
    // depends_on: [
    //   'data'
    // ],
    stop_grace_period: '1s',
    // healthcheck: {
    //   // https://github.com/neo4j/docker-neo4j/issues/114
    //   test: "/var/lib/neo4j/bin/neo4j status",
    //   timeout: `20s`,
    //   retries: 10
    // }
  }

  YAMLUtils.addDependsOn(service, config, 'data_wait')
  YAMLUtils.mapAppend(service, 'environment', env)

  ymlJSON.services['database_' + moduleName] = service
  ymlJSON.services['database_' + moduleName + '_wait'] = YAMLUtils.createServiceWaitTCP('database_' + moduleName, port_admin)

  ymlJSON = YAMLUtils.setupDBPersistData(ymlJSON, config, moduleName, data_path)

  return ymlJSON
} 

// function setupApp(ymlJSON, config) {
//   YAMLUtils.mapAppend(ymlJSON.services.app, 'environment', {
//     DATABASE_HOST_NEO4J: 'database-' + moduleName + '.dev-local',
//     DATABASE_USERNAME_NEO4J: 'neo4j',
//   })

//   return ymlJSON
// }

module.exports = function (ymlJSON, config) {

  if (config.database.enabled_drivers.indexOf(moduleName) === -1) {
    return ymlJSON
  }
  ymlJSON = setupDB(ymlJSON, config)
  //ymlJSON = setupApp(ymlJSON, config)

  YAMLUtils.setupAppEnvironmentDatabase(ymlJSON, config, moduleName, {
    username: 'neo4j'
  })
  YAMLUtils.addAppDependsOn(ymlJSON, config, moduleName)
  
  return ymlJSON
}