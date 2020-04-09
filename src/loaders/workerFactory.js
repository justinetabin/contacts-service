const ContactsMongoStore = require('../services/contactsMongoStore')
const ContactsWorker = require('../workers/contactsWorker')

module.exports = class WorkerFactory {

  constructor(contactsMongoDb) {
    this.contactsMongoDb = contactsMongoDb
  }

  createContactWorker() {
    return new ContactsWorker(new ContactsMongoStore(this.contactsMongoDb))
  }

}