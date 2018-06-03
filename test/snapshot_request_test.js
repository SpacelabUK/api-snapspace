const config = require('../config.js').get(process.env.NODE_ENV);
const request = require('supertest');
const Client = require('../models/clients.js');
const mongoose = require('mongoose');

const app = require('../server.js');

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

    it('should update the snapshot requests for the specified client and project', async (done) => {
      const client = new Client({
        name: 'Client',
        projects: [
          {
            name: 'Project',
            snapshotRequests: [{ name: 'name1' }],
          },
        ],
      });
      let savedClient;
      let updatedClient;
      let req;
      try {
        savedClient = await client.save();
        console.log(savedClient);
        const clId = savedClient._id;
        const prId = savedClient.projects[0]._id;
        console.log(clId);
        console.log(prId);
        req = {
          snapshotRequests: savedClient.projects[0].snapshotRequests,
        };
        request(app)
          .post(`/client/${clId}/project/${prId}/snapshotRequests`)
          .send(req)
          .expect(200)
          .expect(async () => {
            updatedClient = await Client.findOne({
              _id: savedClient._id,
              'projects._id': savedClient.projects[0]._id,
            });
            if ((updatedClient.projects[0].snapshotRequests[0].name)
              !== (req.snapshotRequests[0].name)) throw new Error('Snapshot request has not been updated');
          })
          .end((err) => {
            if (err) return done(err);
            return done();
          });
      } catch (err) {
        console.log(err);
      }
    });
  });
});
