const config = require('../config.js').get(process.env.NODE_ENV);
const request = require('supertest');
const { expect } = require('chai');
const Client = require('../models/clients.js');
const mongoose = require('mongoose');

const app = require('../server.js');

describe('client_controller.js', () => {
  describe('createClient', () => {
    let client;

    before((done) => {
      mongoose.connect(config.database.uri);
      mongoose.connection
        .once('open', () => {
          done();
        })
        .on('error', (error) => {
          console.log(error);
        });
    });

    beforeEach((done) => {
      mongoose.connection.collections.clients.drop(() => {
        client = new Client({
          name: 'Client',
          projects: [],
        });
        done();
      });
    });

    it('should create a new client and return it', async () => {
      const response = await request(app)
        .post('/client')
        .send(client);

      const savedClient = await Client.findOne({
        _id: response.body._id,
      });

      expect(response.body.name).to.equal(client.name);
      expect(savedClient.name).to.equal(client.name);
    });

    it('should return response in JSON format and with a 201 status', async () => {
      const response = await request(app)
        .post('/client')
        .send(client);

      expect(response.statusCode).to.equal(201);
      expect(response.type).to.equal('application/json');
    });

    it('should return error with 409 code if client with this name already exists', async () => {
      await client.save();
      const response = await request(app)
        .post('/client')
        .send(client);

      expect(response.statusCode).to.equal(409);
    });
  });
});
