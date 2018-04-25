const express = require('express'),
      config = require("./config.js").get(process.env.NODE_ENV),
      snapshotController = require("./controllers/snapshot_controller.js");

const router = express.Router();

const sendFileOptions = {
    root: config.root
  }

router.get('/', (req, res) => {
    res.redirect('/upload-snapshot');
});

router.get('/upload-snapshot', (req, res) => {
    res.sendFile('./views/snapshot_upload.html', sendFileOptions);
});

router.get('/view-snapshots', (req, res) => {
    res.send('./views/snapshot_browse.html', sendFileOptions);
});

router.get('/amazon-config', snapshotController.getAmazonConfig);

router.post('/snapshot', snapshotController.saveSnapshot);

module.exports = router;