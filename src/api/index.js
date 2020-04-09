const WorkerFactory = require('../loaders/workerFactory')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')

module.exports = {
  /**
   * 
   * @param {WorkerFactory} workerFactory
   */
  routes: (workerFactory) => {
    return []
      .concat(require('./routes/contacts')(workerFactory.createContactWorker()))
  },

  /**
   * 
   */
  plugins: () => {
    return []
      .concat(Inert)
      .concat(Vision)
      .concat(require('./plugins/swagger'))
  }
}