const mongodb = require('mongodb')

module.exports = (uri) => {
  return mongodb.MongoClient.connect(uri, { useUnifiedTopology: true })
}