const AWS = require('aws-sdk'),
    config = require('../config.js').get(process.env.NODE_ENV);

const getSignedAWSURL = (req, res) => {

    const credentials = new AWS.SharedIniFileCredentials({ profile: 'snapspace-app' });
    AWS.config.credentials = credentials;

    const s3 = new AWS.S3();

    const myBucket = config.aws.bucketName;
    const myKey = req.query.imageFileName;
    const signedUrlExpireSeconds = 60 * 5;

    const signedAWSURL = {
        signedAWSURL: s3.getSignedUrl('putObject', {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds
        })
    };

    res.send(signedAWSURL);
}

module.exports = {
    getSignedAWSURL
};