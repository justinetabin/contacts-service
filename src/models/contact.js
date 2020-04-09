const uuid = require('uuid')

module.exports = class Contact {
  
  constructor({ 
    _id = uuid.v4(), 
    firstName, 
    lastName, 
    email, 
    phoneNumber, 
    createdAt = new Date(), 
    updatedAt = new Date() 
  }) {
    this._id = _id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.phoneNumber = phoneNumber
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}