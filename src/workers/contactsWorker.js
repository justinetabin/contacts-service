const Contact = require('../models/contact')

module.exports = class ContactsWorker {

  /**
   * 
   * @param {ContactsMongoStore} contactStore 
   */
  constructor(contactStore) {
    this.contactStore = contactStore
  }

  /**
   * 
   * @returns {Promise<[Contact]>}
   */
  async fetchContacts() {
    const contacts = await this.contactStore.fetchContacts()
    return contacts.map(o => new Contact(o))
  }

  /**
   * 
   * @param {String} contactId 
   * @returns {Promise<Contact>}
   */
  async getContact(contactId) {
    const contact = await this.contactStore.getContact(contactId)
    if (contact == null) {
      throw Error('Contact not found')
    } else {
      return new Contact(contact)
    }
  }

  /**
   * 
   * @param {Contact} contact 
   */
  async createContact(contact) {
    const res = await this.contactStore.createContact(contact)
    if (res === true) {
      return contact
    } else {
      throw Error('Contact not created')
    }
  }

  /**
   * 
   * @param {Contact} contact 
   */
  async updateContact(contact) {
    contact.updatedAt = new Date()
    return this.contactStore.updateContact(contact)
  }

  /**
   * 
   * @param {String} contactId 
   */
  async deleteContact(contactId) {
    return await this.contactStore.deleteContact(contactId)
  }
}