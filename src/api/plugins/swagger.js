const HapiSwagger = require('hapi-swagger')
const conifg = require('../../config')

exports.plugin = {
  name: 'Swagger',
  version: '1.0.0',
  register: async (server, options) => {
    const swaggerOptions = {
      info: {
        title: conifg.SWAGGER_DOC_TITLE,
        version: conifg.SWAGGER_DOC_VERSION,
      }
    }

    await server.register({
      plugin: HapiSwagger,
      options: swaggerOptions
    })
  }
}