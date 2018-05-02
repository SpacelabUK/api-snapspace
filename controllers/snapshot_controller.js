
const AWS = require('aws-sdk'),
    Snapshot = require('../models/snapshots.js'),
    mongoose = require('mongoose'),
    path = require('path'),
    config = require('../config.js').get(process.env.NODE_ENV);

const sendFileOptions = {
    root: config.root
}

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
            res.status(400).sendFile('./views/snapshot_complete.html', sendFileOptions);
        }
    });
}

//provides Amazon S3 config to front-end so snapshot image can be saved to AWS
const getAmazonConfig = (req, res) => {
    const amazonConfig = {
        "url": config.aws.url,
        "bucketName": config.aws.bucketName,
        "secretKey": config.aws.secretKey,
        "accessKey": config.aws.accessKey,
        "region": config.aws.region
    };
    res.send(amazonConfig);
}

module.exports = {
    getAmazonConfig,
    saveSnapshot
};

