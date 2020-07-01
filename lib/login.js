const inquirer = require('inquirer');

module.exports = {
  askGithubCredentials: () => {
    const questions = [
      {
        name: 'token',
        type: 'input',
        message: 'Please provide a GitHub access token:',
        validate: function (value) {
          if (value.length > 0) {
            return true;
          }

          return 'Please enter a GitHub access token.';
        }
      }
    ];
    return inquirer.prompt(questions);
  }
};
