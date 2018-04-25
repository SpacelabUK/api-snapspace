
var config = {

  production: {
    aws: {
      bucketName: 'snapspace',
      url: 'https://s3.eu-west-2.amazonaws.com/',
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "eu-west-2"
    },
    database: {
      uri: process.env.MONGODB_URI
    },
    root: __dirname
  },

  test: {
    aws: {
      bucketName: 'snapspace-test',
      url: 'https://s3.eu-west-2.amazonaws.com/',
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "eu-west-2"
    },
    database: {
      uri: process.env.MONGODB_URI
    }
  },

  development: {
    aws: {
      bucketName: 'snapspace-dev',
      url: 'https://s3.eu-west-2.amazonaws.com/',
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "eu-west-2"
    },
    app: {
      port: 8080
    },
    database: {
      uri: 'mongodb://localhost:27017/snapspace_dev'
    },
    root: __dirname
  }

}

exports.get = function get(env) {
  return config[env];
}