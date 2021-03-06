module.exports = {
    "extends": "airbnb-base",
    "globals": {
      "expect": true
    },
    "plugins": [
      "chai-friendly"
    ],
    "env": {
      "mocha": true,
      "jest": true
    },
    "rules": {
      "linebreak-style": ["error", "windows"],
      "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
      "no-unused-expressions": 0,
      "chai-friendly/no-unused-expressions": 2,
      "no-underscore-dangle": 0,
      "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
  }
  };