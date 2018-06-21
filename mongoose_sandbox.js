
const mongoose = require('mongoose');
const config = require('./config.js').get(process.env.NODE_ENV);
const Client = require('./models/clients.js');
const Snapshot = require('./models/snapshots.js');

mongoose.Promise = global.Promise;

(async () => {
  try {
    await mongoose.connect(config.database.uri);

    const clients = await Client.find({});
    if (clients.length) {
      await mongoose.connection.collections.clients.drop();
    }

    const snapshots = await Snapshot.find({});
    if (snapshots.length) {
      await mongoose.connection.collections.snapshots.drop();
    }

    const db = mongoose.connection;

    const client = new Client({
      name: 'Client',
      projects: [
        {
          name: 'ProjectOne',
          snapshotRequests: [{ status: 'active', name: 'name1', sequence: 1 }],
        },
      ],
    });

    const savedClient = await client.save();

    const snapshotData = {
      imageURL: 'https://s3.eu-west-2.amazonaws.com/snapspace-dev/1524242200913.jpg',
      comment: 'comment',
      requestId: savedClient.projects[0].snapshotRequests[0]._id,
    };

    const snapshot = new Snapshot(snapshotData);

    const savedSnapshot = await snapshot.save();

    const retrievedClient = await Client.findOne({
      _id: savedClient._id,
    });

    console.log(retrievedClient.projects[0].snapshotRequests.id(savedSnapshot.requestId));

    await db.collections.clients.drop();
    await db.collections.snapshots.drop();

    db.close();
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
})();

