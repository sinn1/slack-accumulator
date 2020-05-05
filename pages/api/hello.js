// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_DB_CONNECTION;
const database = process.env.MONGO_DB;

const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('test');
  console.log(`connected to collection: test`);

  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

export default async (req, res) => {
  res.statusCode = 200;

  MongoClient.connect(uri, (err, client) => {
    const db = client.db(database);
    console.log(`connected to db: ${database}`);

    insertDocuments(db, () => {
      client.close();
    });
  });

  res.json({ name: 'John Doe' })
}
