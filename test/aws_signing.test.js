const expect = require('chai').expect,
    config = require('../config.js').get(process.env.NODE_ENV),
    request = require('supertest'),
    validator = require('validator');

const app = require('../server.js')

describe('getSignedAWSURL', () => {

    it('should return a valid URL', (done) => {
        request(app)
            .get('/signedAWSURL')
            .query({ imageFileName: 'imageFileName' })
            .expect( (res) => {
                if (!validator.isURL(res.body.signedAWSURL)) {
                    throw new Error('No URL');
                }
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    });

});