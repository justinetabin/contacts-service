const { Db } = require('mongodb')
const Contact = require('../models/contact')

module.exports = class ContactsMongoStore {

  /**
   * 
   * @param {Db} db 
   */
  constructor(contactsMongoDb) {
    this.collection = contactsMongoDb.collection('contacts')
  }

  /**
   * 
   * @returns {Promise<[Contact]>}
   */
  async fetchContacts() {
    return await this.collection.find().toArray()
  }

  /**
   * 
   * @param {String} contactId 
   * @returns {Promise<Contact>}
   */
  async getContact(contactId) {
    return await this.collection.findOne({ _id: contactId })
  }

  /**
   * 
   * @param {Contact} contact 
   * @returns {Boolean}
   */
  async createContact(contact) {
    const res = await this.collection.insertOne(contact)
    return res.result.ok === 1
  }

  /**
   * 
   * @param {Contact} contact 
   * @returns {Boolean}
   */
  async updateContact(contact) {
    const res = await this.collection.updateOne(
      { _id: contact._id },
      { $set: contact }
    )
    return res.result.ok === 1
  }

  /**
   * 
   * @param {String} contactId 
   * @returns {Boolean}
   */
  async deleteContact(contactId) {
    const res = await this.collection.deleteOne(
      { _id: contactId }
    )
    return res.result.ok === 1
  }

}