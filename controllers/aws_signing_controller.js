const AWS = require('aws-sdk'),
    config = require('../config.js').get(process.env.NODE_ENV);
    
    const app = require('../server.js')

const getSignedAWSURL =(req, res) => {

    const s3 = new AWS.S3()
    AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY})
    
    const myBucket = config.aws.bucketName;
    const myKey = req.query.imageFileName;
    const signedUrlExpireSeconds = 60 * 5

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