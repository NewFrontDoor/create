'use strict';
const execa = require('execa');
const hasYarn = require('has-yarn');
const chalk = require('chalk');
const chalkPipe = require('chalk-pipe');
const inquirer = require('inquirer');
const config = require('./config');

const Spinners = require('spinnies');

const utility = require('./lib/utility');
const {initialQs, nextjsQs, sanityQs, themeQs} = require('./lib/questions');
const github = require('./lib/github');
const factory = require('./lib/factories');

const {Octokit} = require('@octokit/rest');

// This is registering a plugin on the inquirer instance
// for changing colours in terminal based on provided hex values
inquirer.registerPrompt('chalk-pipe', require('inquirer-chalk-pipe'));

// Build up the array of CLI questions
const questions = [
  ...initialQs,
  ...nextjsQs,
  ...sanityQs,
  ...themeQs(chalkPipe)
];

module.exports = async () => {
  // Set the org name for accessing github
  const nfd = config.githubOrg;

  // Get stored token and initialize auth object
  let token = github.getStoredGithubToken();

  if (!token) {
    token = await github.getPersonalAccessToken();
  }

  const octokit = new Octokit({auth: token});

  // CLI query function - get all the details!!
  const answers = await inquirer
    .prompt(questions)
    .then((answers) => {
      return answers;
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    });

  // Orgname here refers to the client church/organisation
  const orgname = await answers.orgname;
  const orgnameKebab = await utility.toKebabCase(answers.orgname);
  const orgurl = await answers.url;

  console.clear();

  console.log(
    'Creating a new project for ' +
      orgname +
      ' (' +
      `${orgurl || orgnameKebab}` +
      ')'
  );

  const spinnies = new Spinners();
  if (answers.scaffold.includes('NextJS')) {
    spinnies.add('nextrepo', {
      text: 'Creating GitHub repo for NextJS app...',
      color: 'greenBright'
    });
    spinnies.add('nextapp', {
      text: 'Create NextJS app',
      color: 'greenBright'
    });
    spinnies.add('pushnextjs', {
      text: 'Push NextJS app to GitHub repo',
      color: 'greenBright'
    });
  }

  if (answers.scaffold.includes('Sanity')) {
    spinnies.add('sanityrepo', {
      text: 'Creating GitHub repo for Sanity project...',
      color: 'greenBright'
    });
    spinnies.add('sanityproject', {
      text: 'Create Sanity project',
      color: 'greenBright'
    });
    spinnies.add('pushsanity', {
      text: 'Push Sanity project to GitHub repo',
      color: 'greenBright'
    });
  }

  // If opted for NextJS, create a NextJS repo
  if (answers.scaffold.includes('NextJS')) {
    const repo = await factory
      .createRepo({
        nfd,
        octokit,
        orgname,
        orgurl,
        orgnameKebab,
        type: 'NextJS'
      })
      .then((result) => {
        spinnies.succeed('nextrepo', {
          text: 'NextJS GitHub repo created!',
          color: 'greenBright'
        });
        return result;
      })
      .catch((error) => {
        spinnies.fail('nextrepo', {
          text: 'NextJS GitHub repo creation failed',
          color: 'redBright'
        });
        console.log(error);
        process.exit(1);
      });
    factory.createNextApp({execa, repo, spinnies});
  }

  // If opted for Sanity, create a Sanity repo
  if (answers.scaffold.includes('Sanity')) {
    const repo = await factory
      .createRepo({
        nfd,
        octokit,
        orgname,
        orgurl,
        orgnameKebab,
        type: 'Sanity'
      })
      .then((result) => {
        spinnies.succeed('sanityrepo', {
          text: 'Sanity GitHub repo created!',
          color: 'greenBright'
        });
        return result;
      })
      .catch((error) => {
        spinnies.fail('sanityrepo', {
          text: 'Sanity GitHub repo creation failed',
          color: 'redBright'
        });
        console.log(error);
        process.exit(1);
      });
    factory.createSanity({execa, repo, orgname, spinnies});
  }
};
