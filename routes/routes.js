const express = require('express');
const { saveSnapshot, getSnapshots } = require('../controllers/snapshot_controller.js');
const { getAWSConfig } = require('../controllers/aws_signing_controller.js');
const { saveSnapshotRequests, getSnapshotRequests } = require('../controllers/snapshot_request_controller');

const router = express.Router();

// provides Amazon S3 config to front-end so snapshot image can be saved to AWS
router.get('/image-aws-config', getAWSConfig);

router.get('/snapshots', getSnapshots);

router.get('/client/:clId/project/:prId/snapshotRequests', getSnapshotRequests);

// saves snapshot to DB
router.post('/snapshot', saveSnapshot);

router.post('/client/:clId/project/:prId/snapshotRequests', saveSnapshotRequests);

module.exports = router;
