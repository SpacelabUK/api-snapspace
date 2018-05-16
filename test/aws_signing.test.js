const request = require('supertest');
const validator = require('validator');

const app = require('../server.js');

describe('getAWSConfig', () => {
  it('should return a valid URL to post image to AWS', (done) => {
    request(app)
      .get('/image-aws-config')
      .query({
        imageFileName: 'imageFileName',
      })
      .expect((res) => {
        if (!validator.isURL(res.body.signedAWSURL)) {
          throw new Error('No URL');
        }
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
  it('should return an error if AWS fails to provide signed URL to post image', (done) => {
    request(app)
      .get('/image-aws-config')
      .query({
        imageFileName: 'imageFileName',
      })
      .expect((res) => {
        if (!validator.isURL(res.body.signedAWSURL)) {
          throw new Error('No URL');
        }
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
