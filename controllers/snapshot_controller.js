
const Snapshot = require('../models/snapshots.js');

//  saves snapshot to DB and sends success message to user
const getSnapshots = (req, res) => {
  Snapshot.find({})
    .sort({ createdAt: -1 })
    .exec((err, snapshots) => {
      if (err) console.log(err);
      console.log(snapshots);
      // const resSnapshots = JSON.stringify
      res.json(snapshots);
    });
};

//  saves snapshot to DB and sends success message to user
const saveSnapshot = (req, res) => {
  const snapshot = new Snapshot({
    imageURL: req.body.imageURL,
    comment: req.body.comment,
  });
  snapshot.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.send(200);
    }
  });
};

module.exports = {
  saveSnapshot,
  getSnapshots,
};

