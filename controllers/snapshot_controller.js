
const Snapshot = require('../models/snapshots.js');

const getSnapshots = (req, res, next) => {
  Snapshot.find({})
    .sort({ createdAt: -1 })
    .exec((err, snapshots) => {
      if (err) {
        next(err.message);
      } else if (!Array.isArray(snapshots) || !snapshots.length) {
        const error = new Error('Snapshots not found');
        error.status = 404;
        next(error);
      } else {
        res.json(snapshots);
      }
    });
};

//  saves snapshot to DB and sends success message to user
const saveSnapshot = (req, res, next) => {
  const snapshot = new Snapshot({
    imageURL: req.body.imageURL,
    comment: req.body.comment,
    requestId: req.body.requestId,
  });
  snapshot.save()
    .then(() => res.send(200))
    .catch((err) => {
      const error = new Error(err.message);
      if (err.name === 'ValidationError') {
        error.status = 422;
      }
      next(error);
    });
};

module.exports = {
  saveSnapshot,
  getSnapshots,
};

