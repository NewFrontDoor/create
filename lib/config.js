const Conf = require('conf');

const config = new Conf({
  defaults: {
    githubOrg: 'newfrontdoor'
  }
});

module.exports = config;
