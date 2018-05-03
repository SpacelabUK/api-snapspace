
const Snapshot = require('../models/snapshots.js'),
    mongoose = require('mongoose');

//saves snapshot to DB and sends success message to user
const saveSnapshot = (req, res) => {
    const snapshot = new Snapshot({
        imageURL: req.body.imageURL,
        comment: req.body.comment
    });
    snapshot.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
        }
    });
}

module.exports = {
    saveSnapshot
};

