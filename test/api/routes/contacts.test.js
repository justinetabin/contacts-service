const { Server } = require('@hapi/hapi')
const WorkerFactory = require('../../../src/loaders/workerFactory')
const HapiServer = require('../../../src/loaders/hapi')
const { MONGODB_URI } = require('../../../src/config')
const MongoDb = require('../../../src/loaders/mongodb')
const { MongoClient } = require('mongodb')
const { expect } = require('chai')

describe('Contacts API Routes', () => {

  /**
   * 
   * @type {MongoClient}
   */
  var mongoClient;

  /**
   * 
   * @type {Server}
   */
  var server;

  /**
   * 
   * @type {WorkerFactory}
   */
  var workerFactory

  before(async () => {
    /**
     * Initialize database connection before test
     */
    mongoClient = await MongoDb(MONGODB_URI)
  })

  beforeEach(async () => {
    /**
     * Initialize Hapi server and workers every tests
     */
    workerFactory = new WorkerFactory(mongoClient.db('test'))
    server = await HapiServer({ host: 'localhost', port: 3001, workerFactory })
  })

  afterEach(async () => {
    /**
     * Stop Hapi server every test
     */
    server.stop()
  })

  after(async () => {
    /**
     * Do cleanup after all tests
     */
    const contactsWorker = workerFactory.createContactWorker()
    const contacts = await contactsWorker.fetchContacts()
    contacts.forEach(async contact => {
      await contactsWorker.deleteContact(contact._id)
    })
  })

  describe('POST /contacts', () => {

    it('should return 200', async () => {
      // given
      const payload = {
        firstName: 'Justine',
        lastName: 'Tabin',
        email: 'justinetabin@yahoo.com',
        phoneNumber: '+639171111111'
      }
      const expectedStatusCode = 200

      // when
      const res = await server.inject({ method: 'POST', url: '/contacts', payload })

      // then
      expect(res.statusCode).to.equal(expectedStatusCode)
    })

    it('should return 400', async () => {
      // given
      const payload = {}
      const expectedStatusCode = 400

      // when
      const res = await server.inject({ method: 'POST', url: '/contacts', payload })

      // then
      expect(res.statusCode).to.equal(expectedStatusCode)
    })
  })

  describe('GET /contacts', () => {
    
    it('should return 200', async () => {
      // given
      const expectedContactsCount = 1
      const expectedStatusCode = 200

      // when
      const res = await server.inject({ method: 'GET', url: '/contacts' })
      const payload = JSON.parse(res.payload)

      // then
      expect(res.statusCode).to.equal(expectedStatusCode)
      expect(payload.length).to.equal(expectedContactsCount)
    })

  })

  describe('GET /contacts/{id}', () => {
    
    it('should return 404', async () => {
      // given
      const expectedStatusCode = 404

      // when
      const res = await server.inject({ method: 'GET', url: '/contacts/1' })

      // then
      expect(res.statusCode).to.equal(expectedStatusCode)
    })

    it('should return 200', async () => {
      // given
      const expectedStatusCode = 200
      const contactsWorker = workerFactory.createContactWorker()

      // when
      const contacts = await contactsWorker.fetchContacts()
      const res = await server.inject({ method: 'GET', url: `/contacts/${contacts[0]._id}` })

      // then
      expect(res.statusCode).to.equal(expectedStatusCode)
    })
  })

  describe('PUT /contacts/{id}', () => {
    
    it('should return 200', async () => {
      // given
      const contactsWorker = workerFactory.createContactWorker()
      const payload = {
        firstName: 'Justino'
      }
      const expectedStatusCode = 200

      // when
      const contacts = await contactsWorker.fetchContacts()
      const res = await server.inject({ method: 'PUT', url: `/contacts/${contacts[0]._id}`, payload })

      // then
      expect(res.statusCode).to.equal(expectedStatusCode)
    })

    it('should return 400', async () => {
      // given
      const contactsWorker = workerFactory.createContactWorker()
      const payload = {
        firstName: ''
      }
      const expectedStatusCode = 400

      // when
      const contacts = await contactsWorker.fetchContacts()
      const res = await server.inject({ method: 'PUT', url: `/contacts/${contacts[0]._id}`, payload })

      // then
      expect(res.statusCode).to.equal(expectedStatusCode)
    })

    it('should return 200, should failed update', async () => {
      // given
      const expectedStatusCode = 200

      // when
      const res = await server.inject({ method: 'PUT', url: `/contacts/1`, payload: {} })
      const isSuccess = res.payload === 'false'

      // then
      expect(isSuccess).to.equal(false)
      expect(res.statusCode).to.equal(expectedStatusCode)
    })
  })

  describe('DELETE /contacts/{id}', async () => {
    
    it('should return 200', async () => {
      // given
      const contactsWorker = workerFactory.createContactWorker()
      const expectedStatusCode = 200

      // when
      const contacts = await contactsWorker.fetchContacts()
      const res = await server.inject({ method: 'DELETE', url: `/contacts/${contacts[0]._id}` })
      const isSuccess = res.payload === 'true'

      // then
      expect(isSuccess).to.equal(true)
      expect(res.statusCode).to.equal(expectedStatusCode)
    })
  })

})