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

  describe('getClients', () => {
    let clientOne;
    let clientTwo;

    before(async () => {
      await mongoose.connect(config.database.uri);
    });

    beforeEach(async () => {
      await mongoose.connection.collections.clients.drop();
      clientOne = {
        name: 'ClientOne',
        projects: [
          {
            name: 'ProjectOne',
            snapshotRequests: [{ status: 'active', name: 'name1', sequence: 1 },
              { status: 'active', name: 'name2', sequence: 2 }],
          },
        ],
      };
      clientTwo = JSON.parse(JSON.stringify(clientOne));
      clientTwo.name = 'ClientTwo';
      clientTwo.projects[0].name = 'ProjectTwo';
    });

    it('should return all saved clients and projects', async () => {
      const newClientOne = new Client(clientOne);
      await newClientOne.save();

      const newClientTwo = new Client(clientTwo);
      await newClientTwo.save();

      const response = await request(app)
        .get('/clients');

      expect(response.body[0].name).to.equal(clientOne.name);
      expect(response.body[1].projects[0].name).to.equal(clientTwo.projects[0].name);
    });

    it('should return 404 if no clients found', async () => {
      const response = await request(app)
        .get('/clients');

      expect(response.statusCode).to.equal(404);
    });
  });
});
