const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const ContactsWorker = require('../../workers/contactsWorker')
const Contact = require('../../models/contact')

/**
 * 
 * @param {ContactsWorker} contactsWorker
 */
module.exports = (contactsWorker) => {
  return [
    {
      method: 'GET',
      path: '/contacts',
      options: {
        tags: ['api']
      },
      handler: (request, h) => {
        return contactsWorker.fetchContacts()
      }
    },

    {
      method: 'GET',
      path: '/contacts/{id}',
      options: {
        tags: ['api'],
        validate: {
          params: Joi.object({ id: Joi.string() })
        }
      },
      handler: async (request, h) => {
        const contactId = request.params.id
        try {
          return await contactsWorker.getContact(contactId)
        } catch (e) {
          return Boom.notFound(e)
        }
      }
    },

    {
      method: 'POST',
      path: '/contacts',
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            phoneNumber: Joi.string().required()
          })
        }
      },
      handler: (request, h) => {
        const contactToCreate = new Contact(request.payload)
        return contactsWorker.createContact(contactToCreate)
      }
    },

    {
      method: 'PUT',
      path: '/contacts/{id}',
      options: {
        tags: ['api'],
        validate: {
          params: Joi.object({ id: Joi.string() }),
          payload: Joi.object({ 
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string().email(),
            phoneNumber: Joi.string()
          })
        }
      },
      handler: (request, h) => {
        const contactToUpdate = new Contact(Object.assign(request.payload, { _id: request.params.id }))
        return contactsWorker.updateContact(contactToUpdate)
      }
    },

    {
      method: 'DELETE',
      path: '/contacts/{id}',
      options: {
        tags: ['api'],
        validate: {
          params: Joi.object({ id: Joi.string() })
        }
      },
      handler: (request, h) => {
        return contactsWorker.deleteContact(request.params.id)
      }
    }
  ]
}