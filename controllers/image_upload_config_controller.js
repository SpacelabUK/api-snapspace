const aws = require('aws-sdk');
const config = require('../config.js').get(process.env.NODE_ENV);

const getImageUploadConfig = (req, res, next) => {
  if (!req.query.imageFileName) {
    const error = new Error('Failed to create image upload URL as no image file name was provided');
    error.status = 422;
    next(error);
  } else {
    if (process.env.NODE_ENV === 'development') {
      const awsCredentials = new aws.SharedIniFileCredentials({ profile: 'snapspace-app' });
      aws.config.credentials = awsCredentials;
    }

    const s3 = new aws.S3({
      signatureVersion: config.aws.signatureVersion,
      region: config.aws.region,
    });

    const myBucket = config.aws.bucketName;
    const myKey = req.query.imageFileName;
    const signedUrlExpireSeconds = 60 * 5;

    const paramsForGetSignedUrl = {
      Bucket: myBucket,
      Key: myKey,
      Expires: signedUrlExpireSeconds,
      ACL: 'public-read',
    };

    s3.getSignedUrl(
      'putObject',
      paramsForGetSignedUrl,
      (err, signedImageUploadUrl) => {
        if (err) {
          const error = new Error('Failed to create signed URL to save image to AWS');
          error.status = 500;
          next(error);
        } else {
          const imageUploadConfig = {
            signedImageUploadUrl,
            imageUrl: `${config.aws.url + myBucket}/${myKey}`,
          };
          res.send(imageUploadConfig);
        }
      },
    );
  }
};

module.exports = {
  getImageUploadConfig,
};
