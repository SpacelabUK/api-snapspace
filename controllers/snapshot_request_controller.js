const Client = require('../models/clients.js');

//  saves snapshot to DB and sends success message to user
const saveSnapshotRequests = async (req, res, next) => {
  try {
    console.log(req.params);
    console.log(req.body.snapshotRequests);

    let client = await Client.findOne({
      _id: req.params.clId,
    });

    const project = client.projects.id(req.params.prId);
    project.snapshotRequests = req.body.snapshotRequests;

    client = await client.save();

    console.log('TEST!');
    console.log(client.projects[0].snapshotRequests);

    res.status(200).send(client);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  saveSnapshotRequests,
};
