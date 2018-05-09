const AWS = require('aws-sdk'),
    config = require('../config.js').get(process.env.NODE_ENV);

const getAWSConfig = (req, res) => {

    console.log("config request received")

    if (process.env.NODE_ENV == 'development') {
        const credentials = new AWS.SharedIniFileCredentials({ profile: 'snapspace-app' });
        AWS.config.credentials = credentials;
    }

    const s3 = new AWS.S3({
        signatureVersion: config.aws.signatureVersion,
        region: config.aws.region
    });

    const myBucket = config.aws.bucketName;
    const myKey = req.query.imageFileName;
    const signedUrlExpireSeconds = 60 * 5;

    const awsConfig = {
        signedAWSURL: s3.getSignedUrl('putObject', {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds,
            ACL: 'public-read'
        }),
        imageURL: config.aws.url + myBucket + '/' + myKey
    };

    res.send(awsConfig);
}

module.exports = {
    getAWSConfig
};