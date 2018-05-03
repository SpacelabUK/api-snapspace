const express = require('express'),
    path = require('path'),
    config = require("../config.js").get(process.env.NODE_ENV),
    { saveSnapshot } = require("../controllers/snapshot_controller.js"),
    { getSignedAWSURL } = require("../controllers/aws_signing_controller.js");

const router = express.Router();

const sendFileOptions = {
    root: config.root
};

//provides Amazon S3 config to front-end so snapshot image can be saved to AWS
router.get('/signedAWSURL', getSignedAWSURL);

//saves snapshot to DB
router.post('/snapshot', saveSnapshot);

module.exports = router;