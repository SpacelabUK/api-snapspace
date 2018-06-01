const { expect } = require('chai');
const config = require('../config.js').get(process.env.NODE_ENV);
const { saveSnapshotRequests } = require('../controllers/snapshot_request_controller');
const Client = require('../models/clients.js');
const mongoose = require('mongoose');

describe('snapshot_request_controller.js', () => {
  describe('updateSnapshotRequests', () => {
    before((done) => {
      mongoose.connect(config.database.uri);
      mongoose.connection
        .once('open', () => { done(); })
        .on('error', (error) => {
          console.log(error);
        });
    });

    afterEach((done) => {
      mongoose.connection.collections.clients.drop(() => {
        done();
      });
    });

    it('should update the snapshot requests', (done) => {
      const client = new Client({
        name: 'Client',
        projects: [
          {
            name: 'Project',
            snapshotRequests: [{ name: 'name1' }],
          },
        ],
      });
      client.save()
        .catch(err => console.log(err))
        .then((savedClient) => {
          const { _id } = savedClient;
          const req = {
            body: {
              snapshotRequests: [
                { _id, name: 'name2' },
              ],
            },
          };
          saveSnapshotRequests(req)
            .then(() => {
              Client.findById(savedClient._id)
                .then((updatedClient) => {
                  expect(updatedClient.projects[0].snapshotRequests[0].title)
                    .to.equal(req.body.snapshotRequests[0].title);
                  done();
                });
            });
        });
    });
  });
});
