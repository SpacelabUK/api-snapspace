
/* eslint no-unused-expressions: 0 */

const { expect } = require('chai');
const assert = require('assert');
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
  before((done) => {
    mongoose.connect(config.database.uri);
    mongoose.connection
      .once('open', () => { done(); })
      .on('error', (error) => {
        console.log(error);
      });
  });

  beforeEach((done) => {
    mongoose.connection.collections.snapshots.drop(() => {
      done();
    });
  });

  it('should create a new snapshot record if image URL is a valid URL', (done) => {
    const snapshot = new Snapshot({
      imageURL: 'https://s3.eu-west-2.amazonaws.com/snapspace-dev/1524242200913.jpg',
      comment: 'comment',
    });
    snapshot.save()
      .then(() => {
        assert(!snapshot.isNew);
        done();
      });
  });

  it('should be invalid if image URL is empty', (done) => {
    const snapshot = new Snapshot({ comment: 'comment' });

    snapshot.validate((err) => {
      expect(err.errors.imageURL).to.exist;
      done();
    });
  });

  it('should be invalid if image URL is not a valid URL', (done) => {
    const snapshot = new Snapshot({ imageURL: 'test' });

    snapshot.validate((err) => {
      expect(err.errors.imageURL).to.exist;
      done();
    });
  });
});

