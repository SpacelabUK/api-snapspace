const request = require('supertest');
const validator = require('validator');
const sinon = require('sinon');
const { expect } = require('chai');
const aws = require('aws-sdk');
const app = require('../server.js');

describe('getImageUploadConfig', () => {
  it('should return a valid URL to upload image to Amazon Web Services storage', async () => {
    const response = await request(app)
      .get('/image-upload-config')
      .query({
        imageFileName: 'imageFileName',
      });

    expect(validator.isURL(response.body.signedImageUploadUrl)).to.equal(true);
  });

  it('should return an error if AWS S3 get signed URL function throws an error', async () => {
    const awsGetSignedUrlStub = sinon.stub(aws.S3.prototype, 'getSignedUrl');
    awsGetSignedUrlStub.callsArgWith(2, 'error', undefined);

    const response = await request(app)
      .get('/image-upload-config')
      .query({
        imageFileName: 'imagename',
      });

    expect(response.status).to.equal(500);
    expect(response.body.error.message).to.equal('Failed to create signed URL to save image to AWS');
    awsGetSignedUrlStub.restore();
  });

  it('should return an error if no image file name provided', async () => {
    const response = await request(app)
      .get('/image-upload-config')
      .query({
        imageFileName: '',
      });

    expect(response.status).to.equal(422);
    expect(response.body.error.message).to.equal('Failed to create image upload URL as no image file name was provided');
  });
});
