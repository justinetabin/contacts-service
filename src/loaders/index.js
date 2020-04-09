const config = require('../config')
const MongoDb = require('./mongodb')
const HapiServer = require('./hapi')
const WorkerFactory = require('./workerFactory')


module.exports = async () => {
  console.log('\n\n')

  /**
   * MongoDB
   */
  const mongoClient = await MongoDb(config.MONGODB_URI)
  console.log(`MongoDB (${config.MONGODB_URI}) loaded`)
  

  /**
   * Workers
   */
  const workerFactory = new WorkerFactory(mongoClient.db(config.MONGODB_DB_NAME))


  /**
   * HapiJS
   */
  const hapiServer = await HapiServer({ 
    host: config.HAPI_HOST,
    port: config.HAPI_PORT,
    workerFactory
  })
  console.log(`Hapi (${hapiServer.info.uri}, ${hapiServer.info.uri}/documentation) loaded`)


  return {
    mongoClient,
    hapiServer
  }
}