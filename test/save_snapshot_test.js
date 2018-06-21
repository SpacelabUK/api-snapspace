
/* eslint no-unused-expressions: 0 */

const { expect } = require('chai');
const request = require('supertest');
const config = require('../config.js').get(process.env.NODE_ENV);
const Snapshot = require('../models/snapshots.js');
const mongoose = require('mongoose');

const app = require('../server.js');

describe('loadExpress', () => {
  it('should 404 unknown endpoint', (done) => {
    request(app)
      .get('/foo/bar')
      .expect(404, done);
  });
});


describe('createSnapshotRecord', () => {
  let snapshotData;

  before(async () => {
    await mongoose.connect(config.database.uri);
  });

  beforeEach(async () => {
    const snapshots = await Snapshot.find({});
    if (snapshots.length) {
      await mongoose.connection.collections.snapshots.drop();
    }
    snapshotData = {
      imageURL: 'https://s3.eu-west-2.amazonaws.com/snapspace-dev/1524242200913.jpg',
      comment: 'comment',
      requestId: '1234',
    };
  });

  it('should create a new snapshot record if image URL is a valid URL', async () => {
    const snapshot = new Snapshot(snapshotData);

    const savedSnapshot = await snapshot.save();
    expect(savedSnapshot.isNew).to.equal(false);
  });

  it('should create a new snapshot record storing comment, image URL, and request ID', async () => {
    const req = snapshotData;

    await request(app)
      .post('/snapshot')
      .send(req);

    const savedSnapshots = await Snapshot.find({});
    expect(savedSnapshots[0].imageURL).to.equal(req.imageURL);
    expect(savedSnapshots[0].comment).to.equal(req.comment);
    expect(savedSnapshots[0].requestId).to.equal(req.requestId);
  });

  it('should be invalid if image URL is empty', (done) => {
    snapshotData.imageURL = '';
    const snapshot = new Snapshot(snapshotData);
    snapshot.validate((err) => {
      expect(err.errors.imageURL).to.exist;
      done();
    });
  });

  it('should be invalid if image URL is not a valid URL', (done) => {
    snapshotData.imageURL = 'test';
    const snapshot = new Snapshot(snapshotData);
    snapshot.validate((err) => {
      expect(err.errors.imageURL).to.exist;
      done();
    });
  });

  it('should respond with 422 and error message if comment is not provided', async () => {
    snapshotData.comment = '';

    const res = await request(app)
      .post('/snapshot')
      .send(snapshotData);

    expect(res.body.error.message).to.exist;
    expect(res.statusCode).to.equal(422);
  });

  it('should respond with 422 and error message if image URL is not valid', async () => {
    snapshotData.imageURL = 'test';

    const res = await request(app)
      .post('/snapshot')
      .send(snapshotData);

    expect(res.body.error.message).to.exist;
    expect(res.statusCode).to.equal(422);
  });
});

