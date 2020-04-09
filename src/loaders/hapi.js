'use strict'
const Hapi = require('@hapi/hapi')
const api = require('../api')

module.exports = async ({
  host, 
  port,
  workerFactory
}) => {

  /**
   * Config
   * @type {Hapi.Server}
   */
  const server = Hapi.Server({ 
    port,
    host
  })

  /**
   * Plugins
   */
  await server.register(api.plugins())

  /**
   * Routes
   */
  server.route(api.routes(workerFactory))

  /**
   * Start server
   */
  await server.start()

  return server
}