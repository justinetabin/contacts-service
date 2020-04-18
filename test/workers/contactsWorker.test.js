const expect = require('chai').expect
const ContactsWorker = require('../../src/workers/contactsWorker')
const Contact = require('../../src/models/contact')

class MockContactStore {

  constructor() {
    this.contacts = [
      {
        _id: 'ac771460-e557-4170-90ca-9fe438a6319d',
        firstName: 'Justine',
        lastName: 'Tabin',
        email: 'justinetabin@gmail.com',
        phoneNumber: '+639175207732',
        createdAt: new Date('2020-04-05T08:46:49.005Z'),
        updatedAt: new Date('2020-04-05T08:46:49.005Z')
      }
    ]
    this.isSuccess = true
  }

  fetchContacts() {
    return Promise.resolve(this.contacts)
  }

  getContact(contactId) {
    return Promise.resolve(this.contacts[0])
  }

  createContact(contact) {
    return Promise.resolve(this.isSuccess)
  }

  updateContact(contact) {
    return Promise.resolve(this.isSuccess)
  }

  deleteContact(contactId) {
    return Promise.resolve(this.isSuccess)
  }
}

/**
 * @type {MockContactStore}
 */
var contactStore

/**
 * 
 * @type {ContactsWorker}
 */
var sut

describe('ContactsWorker', () => {

  beforeEach(() => {
    contactStore = new MockContactStore()
    sut = new ContactsWorker(contactStore)
  })
  
  it('should return list of Contact, each item should be instance of Contact', async () => {
    // given
    const expectedContacts = contactStore.contacts.map(o => new Contact(o))

    // when
    const fetchedContacts = await sut.fetchContacts()

    // then
    expect(fetchedContacts).to.eql(expectedContacts)
    fetchedContacts.forEach(fetchedContact => {
      expect(fetchedContact).to.instanceOf(Contact)
    })
  })

  it('should return a Contact, should be instance of Contact', async () => {
    // given
    const expectedContact = new Contact(contactStore.contacts[0])

    // when
    const gotContact = await sut.getContact('')

    // then
    expect(gotContact).to.eql(expectedContact)
    expect(gotContact).to.instanceOf(Contact)
  })

  it('should create a Contact', async () => {
    // given
    const contact = contactStore.contacts[0]
    delete contact._id
    delete contact.updatedAt
    delete contact.createdAt
    const expectedContact = new Contact(contact)

    // when
    const result = await sut.createContact(expectedContact)

    // then
    expect(result).to.eql(expectedContact)
  })

  it('should update a Contact, should update Contact updatedAt', async () => {
    // given
    const expectedContact = new Contact(contactStore.contacts[0])
    const beforeUpdatedAt = expectedContact.updatedAt

    // when
    const result = await sut.updateContact(expectedContact)
    const afterUpdatedAt = expectedContact.updatedAt

    // then
    expect(result).to.eql(expectedContact)
    expect(afterUpdatedAt).to.not.equal(beforeUpdatedAt)
  })

  it('should delete a Contact', async () => {
    // given

    // when
    const result = await sut.deleteContact('')

    // then
    expect(result).to.equal(true)
  })

  it('should fail to get a Contact', async () => {
    // given
    contactStore.contacts = []

    // when
    var gotError
    try {
      await sut.getContact('')
    } catch (error) {
      gotError = error
    }

    // then
    expect(gotError.message).to.equal(Error('Contact not found').message)
  })

  it('should fail to return a Contact', async () => {
    // given
    const contact = contactStore.contacts[0]
    delete contact._id
    delete contact.updatedAt
    delete contact.createdAt
    const expectedContact = new Contact(contact)

    // when
    contactStore.isSuccess = false
    var gotError
    try {
      await sut.createContact(expectedContact)
    } catch (error) {
      gotError = error
    }

    // then
    expect(gotError.message).to.equal('Contact not created')
  })

})