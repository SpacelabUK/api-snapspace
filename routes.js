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

//Snapshot upload page
router.get('/upload-snapshot', (req, res) => {
    res.sendFile('./views/snapshot_upload.html', sendFileOptions);
});

//Page for browsing snapshots
router.get('/view-snapshots', (req, res) => {
    res.send('./views/snapshot_browse.html', sendFileOptions);
});

//provides Amazon S3 config to front-end so snapshot image can be saved to AWS
router.get('/amazon-config', snapshotController.getAmazonConfig);

//saves snapshot to DB
router.post('/snapshot', snapshotController.saveSnapshot);

module.exports = router;