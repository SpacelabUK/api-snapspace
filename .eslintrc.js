module.exports = {
    "extends": "airbnb-base",
    "globals": {
      "expect": true
    },
    "env": {
      "mocha": true,
      "jest": true
    },
    "rules": {
      "linebreak-style": ["error", "windows"],
      "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
      "no-underscore-dangle": 0,
      "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
  }
  };