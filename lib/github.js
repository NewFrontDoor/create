const Configstore = require('configstore');

const login = require('./login');
const pkg = require('../package.json');

const conf = new Configstore(pkg.name);

let octokit;

module.exports = {
  getInstance: () => {
    return octokit;
  },

  getStoredGithubToken: () => {
    return conf.get('github.token');
  },

  getPersonalAccessToken: async () => {
    const credentials = await login.askGithubCredentials();

    try {
      if (credentials.token) {
        conf.set('github.token', credentials.token);
        return credentials.token;
      }

      throw new Error('GitHub token was not provided in the response');
    } finally {
      console.log('Token acquired');
    }
  }
};
