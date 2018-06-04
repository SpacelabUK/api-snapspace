const config = require('../config.js').get(process.env.NODE_ENV);
const request = require('supertest');
const { expect } = require('chai');
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

    it('should save new snapshot requests for the specified client and project', async () => {
      const client = new Client({
        name: 'Client',
        projects: [
          {
            name: 'Project',
          },
        ],
      });
      const savedClient = await client.save();

      const clId = savedClient._id;
      const prId = savedClient.projects[0]._id;
      const req = {
        snapshotRequests: [{ status: 'active', name: 'name1' },
          { status: 'active', name: 'name2' }],
      };

      const response = await request(app)
        .post(`/client/${clId}/project/${prId}/snapshotRequests`)
        .send(req);

      const updatedClient = await Client.findOne({
        _id: savedClient._id,
        'projects._id': savedClient.projects[0]._id,
      });

      expect(response.statusCode).to.equal(200);
      expect(updatedClient.projects[0].snapshotRequests).to.have.length(2);
      expect(updatedClient.projects[0].snapshotRequests[0].name).to.equal('name1');
      expect(updatedClient.projects[0].snapshotRequests[1].name).to.equal('name2');
    });

    it('should update existing snapshot requests for the specified client and project', async () => {
      const client = new Client({
        name: 'Client',
        projects: [
          {
            name: 'Project',
            snapshotRequests: [{ status: 'active', name: 'name1' }],
          },
        ],
      });
      const savedClient = await client.save();

      const clId = savedClient._id;
      const prId = savedClient.projects[0]._id;
      savedClient.projects[0].snapshotRequests[0].name = 'name2';
      const req = {
        snapshotRequests: savedClient.projects[0].snapshotRequests,
      };

      const response = await request(app)
        .post(`/client/${clId}/project/${prId}/snapshotRequests`)
        .send(req);

      const updatedClient = await Client.findOne({
        _id: savedClient._id,
        'projects._id': savedClient.projects[0]._id,
      });

      expect(response.statusCode).to.equal(200);
      expect(updatedClient.projects[0].snapshotRequests[0].name).to.equal('name2');
    });
  });
});
