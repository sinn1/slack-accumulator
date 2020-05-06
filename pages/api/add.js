import moment from 'moment';
const parse = require('urlencoded-body-parser');

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_DB_CONNECTION;
const database = process.env.MONGO_DB;

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const getDocumentKey = (team_id, channel_id, name) => {
  return `${team_id}-${channel_id}-${name}`;
}

export default async (req, res) => {
  res.statusCode = 200;
  var data = await parse(req);

  const {
    team_id,
    channel_id,
    channel_name,
    text,
  } = data

  if (!text) {
    return res.json(data);
  }

  const commandArgs = text?.split(' ');
  
  if (commandArgs.length < 2) {
    return res.send("Not enough commands supplied. Try /add [name] [value] [?days]");
  }

  const name = commandArgs[0];
  const key = getDocumentKey(team_id, channel_id, name);
  const value = commandArgs[1];
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    return res.send(`Value needs to be a whole number: ${value}.`);
  }
  const now = new Date();

  new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true}).connect((err, client) => {
    const db = client.db(database);
    console.log(`connected to db: ${database}`);

    const collection = db.collection('accumulations');
    console.log(`connected to collection: accumulations`);

    // Insert some documents
    collection.findOne({ _id: key })
      .then((doc) => {
        if (doc) {
          console.log(`Found doc: ${doc}`);
          collection.updateOne({
            _id: key,
          }, {
            $push: { data: { timestamp: now, value: parsedValue }},
          });
        } else {
          console.log(`Not found doc`);
          const days = commandArgs[2];
          const parsedDays = parseInt(days, 10);
          if (isNaN(parsedDays)) {
            return res.send(`Number of days should be a whole number: ${days}`);
          }
    
          collection.insertOne({
            _id: key,
            team_id,
            channel_id,
            channel_name,
            name,
            endDate: now.addDays(parsedDays),
            goalValue: parsedValue, 
            data: [],
          });
        }
    
        collection.findOne({ _id: key })
          .then((updatedDoc) => {
            if (updatedDoc) {
              console.log(`Found updatedDoc`, updatedDoc);

              const currentTotal = updatedDoc.data.reduce((prev, next) => {
                return prev += next.value;
              }, 0);

              console.log(`currentTotal: ${currentTotal}`);
              const threshold = updatedDoc.goalValue;
              const endDate = moment(updatedDoc.endDate);
              const daysLeft = endDate.diff(moment(now), 'days');

              return res.send(`Progress for *${name}*: *${currentTotal}* out of goal *${threshold}* with *${daysLeft}* days left.`);
            } else {
              return res.send("Opps, something went wrong!");
            }
          });
      });
  });
}
