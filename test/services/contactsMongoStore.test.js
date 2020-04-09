const expect = require('chai').expect
const config = require('../../src/config')
const mongoLoader = require('../../src/loaders/mongodb')
const ContactsMongoStore = require('../../src/services/contactsMongoStore')
const Contact = require('../../src/models/contact')

describe('ContactsMongoStore', () => {
  
  /**
   * 
   * @type {Contact}
   */
  var testContact

  /**
   * 
   * @type {ContactsMongoStore}
   */
  var sut

  before(async () => {
    const mongoClient = await mongoLoader(config.MONGODB_URI)
    const contactsDb = mongoClient.db('test')
    sut = new ContactsMongoStore(contactsDb)
    testContact = new Contact({ firstName: 'Justine', lastName: 'Tabin', email: 'justinetabin@gmail.com', phoneNumber: '+639175207732' })
    return Promise.resolve()
  })

  beforeEach(async () => {
    if (sut != null) {
      await sut.createContact(testContact)
    }
    return Promise.resolve()
  })
  
  afterEach(async () => {
    if (sut != null) {
      await sut.deleteContact(testContact._id)
    }
    return Promise.resolve()
  })

  it('should return all contacts', async () => {
    // given
    const expectedContact = testContact

    // when
    const fetchedContacts = await sut.fetchContacts()

    // then
    expect(fetchedContacts).to.eql([expectedContact])
  })

  it('should return a contact', async () => {
    // given
    const expectedContact = testContact

    // when
    const gotContact = await sut.getContact(expectedContact._id)

    // then
    expect(gotContact).to.eql(expectedContact)
  })

  it('should update a contact', async () => {
    // given
    var expectedContact = testContact

    // when
    var createdContact = await sut.getContact(expectedContact._id)
    expectedContact.firstName = 'Justino'
    expectedContact.updatedAt = new Date()
    const result = await sut.updateContact(expectedContact)
    var updatedContact = await sut.getContact(expectedContact._id)

    // then
    expect(result).to.equal(true)
    expect(createdContact).not.eql(updatedContact)
  })

  it('should delete a contact', async () => {
    // given
    var expectedContact = testContact

    // when
    const result = await sut.deleteContact(expectedContact._id)
    var createdContact = await sut.getContact(expectedContact._id)

    // then
    expect(result).to.equal(true)
    expect(createdContact).to.equal(null)
  })
})