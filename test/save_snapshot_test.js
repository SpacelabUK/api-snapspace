
const expect = require('chai').expect,
    assert = require('assert'),
    request = require('supertest'),
    express = require('express'),
    config = require('../config.js').get(process.env.NODE_ENV),
    Snapshot = require('../models/snapshots.js'),
    mongoose = require('mongoose');

    const app = require('../server.js')

mongoose.Promise = global.Promise;

describe('loadExpress', () => {
    it('should respond to /', (done) => {
        request(app)
          .get('/')
          .expect(302, done)
          .end((err, res) => {
            if (err) return done(err);
            done();
      });
    });

    it('should 404 unknown endpoint', (done) => {
        request(app)
            .get('/foo/bar')
            .expect(404, done);
    });
});

describe('loadSnapshotUpload', () => {
    it('should send HTML file', (done) => {
        request(app)
          .get('/upload-snapshot')
          .end((err, res) => {
            expect(res.statusCode).to.equal(200); 
            expect(res.header['content-type']).to.equal('text/html; charset=UTF-8');
            done();
      });
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
            imageURL: "https://s3.eu-west-2.amazonaws.com/snapspace-dev/1524242200913.jpg", 
            comment: 'comment' 
        });
        snapshot.save()
            .then(() => {
                assert(!snapshot.isNew);
                done();
            });
    });

    it('should be invalid if image URL is empty', function (done) {
        const snapshot = new Snapshot({ comment: 'comment' });

        snapshot.validate(function (err) {
            expect(err.errors.imageURL).to.exist;
            done();
        });
    });

    it('should be invalid if image URL is not a valid URL', function (done) {
        const snapshot = new Snapshot({ imageURL: "test" });

        snapshot.validate(function (err) {
            expect(err.errors.imageURL).to.exist;
            done();
        });
    });
});

