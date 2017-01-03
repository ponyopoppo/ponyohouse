const MongoClient = require('mongodb').MongoClient;

const mongoURL = 'mongodb://admin:ponyoponyo9@ds054289.mlab.com:54289/ponyohome';
var db;
MongoClient.connect(mongoURL, (err, database) => {
  if (err) return console.log(err);
  db = database;
});

const collection = (name) => {
  return db.collection(name);
};

module.exports = {
  collection: collection,
};
