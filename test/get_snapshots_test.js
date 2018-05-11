
/* eslint no-unused-expressions: 0 */

const request = require('supertest');
const Snapshot = require('../models/snapshots.js');
const mongoose = require('mongoose');

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
            console.log(res.body);
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
});

