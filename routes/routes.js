const express = require('express'),
    { saveSnapshot } = require("../controllers/snapshot_controller.js"),
    { getAWSConfig } = require("../controllers/aws_signing_controller.js");

const router = express.Router();

//provides Amazon S3 config to front-end so snapshot image can be saved to AWS
router.get('/image-aws-config', getAWSConfig);

//saves snapshot to DB
router.post('/snapshot', saveSnapshot);

module.exports = router;