
const config = require('../config.js').get(process.env.NODE_ENV);
const request = require('supertest');
const { expect } = require('chai');
const Client = require('../models/clients.js');
const mongoose = require('mongoose');

const app = require('../server.js');

describe('project_controller.js', () => {
  describe('createProject', () => {
    let client;
    let project;

    before(async () => {
      await mongoose.connect(config.database.uri);
    });

    beforeEach(async () => {
      const clients = await Client.find({});
      if (clients.length) {
        await mongoose.connection.collections.clients.drop();
      }
      client = new Client({
        name: 'Client',
        projects: [{ name: 'ProjectOne' }],
      });
      project = { name: 'ProjectTwo' };
    });

    it('should create a new project in database', async () => {
      const newClient = await client.save();

      await request(app)
        .post(`/client/${newClient._id}/project`)
        .send(project);

      const clients = await Client.find();
      expect(clients[0].projects[1].name).to.equal(project.name);
    });

    it('should return the new project', async () => {
      const newClient = await client.save();

      const response = await request(app)
        .post(`/client/${newClient._id}/project`)
        .send(project);

      expect(response.body.name).to.equal(project.name);
    });

    it('should return a 201 status code and response in JSON format', async () => {
      const newClient = await client.save();

      const response = await request(app)
        .post(`/client/${newClient._id}/project`)
        .send(project);

      expect(response.statusCode).to.equal(201);
      expect(response.type).to.equal('application/json');
    });
  });
});
