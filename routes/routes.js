const express = require('express');
const { saveSnapshot, getSnapshots } = require('../controllers/snapshot_controller.js');
const { getImageUploadConfig } = require('../controllers/image_upload_config_controller.js');
const { saveSnapshotRequests, getSnapshotRequests } = require('../controllers/snapshot_request_controller');
const { createClient, getClients } = require('../controllers/client_controller.js');
const { createProject } = require('../controllers/project_controller');

const router = express.Router();

// provides Amazon S3 config to front-end so snapshot image can be saved to AWS
router.get('/image-upload-config', getImageUploadConfig);

router.get('/snapshots', getSnapshots);

router.get('/clients', getClients);

router.get('/client/:clId/project/:prId/snapshotRequests', getSnapshotRequests);

// saves snapshot to DB
router.post('/snapshot', saveSnapshot);

router.post('/client/:clId/project/:prId/snapshotRequests', saveSnapshotRequests);

router.post('/client', createClient);

router.post('/client/:clId/project', createProject);

module.exports = router;
