
/* eslint no-unused-expressions: 0 */

const request = require('supertest');
const Snapshot = require('../models/snapshots.js');
const mongoose = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));

const { expect } = chai;
const app = require('../server.js');

describe('getSnapshots', () => {
  const snapshot = new Snapshot({
    imageURL: 'https://validurl.com',
    comment: 'comment',
  });

  afterEach((done) => {
    mongoose.connection.collections.snapshots.drop(() => {
      done();
    });
  });

  it('should return a JSON object', (done) => {
    snapshot.save()
      .catch(err => console.log(err))
      .then(() => {
        request(app)
          .get('/snapshots')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
  });

  it('should return snapshot from collection', (done) => {
    snapshot.save()
      .catch(err => console.log(err))
      .then(() => {
        request(app)
          .get('/snapshots')
          .expect((res) => {
            const resSnapshot = res.body.snapshots[0];
            if (resSnapshot.comment !== snapshot.comment) throw new Error('Comment does not match DB doc');
            if (resSnapshot.imageURL !== snapshot.imageURL) throw new Error('ImageURL does not match DB doc');
          })
          .end((err) => {
            if (err) return done(err);
            return done();
          });
      });
  });

  it('should return an error if database fails to return data', (done) => {
    /* eslint no-unused-vars: 0 */
    const snapshotStub = sinon.stub(Snapshot, 'find');
    snapshotStub.throws();
    request(app)
      .get('/snapshots')
      .expect(500)
      .end((err) => {
        snapshotStub.restore();
        if (err) return done(err);
        return done();
      });
  });
});

