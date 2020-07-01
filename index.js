'use strict';
const execa = require('execa');
const hasYarn = require('has-yarn');
const chalk = require('chalk');
const chalkPipe = require('chalk-pipe');
const inquirer = require('inquirer');

const utility = require('./utility');
const {initialQs, nextjsQs, sanityQs, themeQs} = require('./questions');
const factory = require('./factories');

const {Octokit} = require('@octokit/rest');
const octokit = new Octokit({auth: process.env.TOKEN});
inquirer.registerPrompt('chalk-pipe', require('inquirer-chalk-pipe'));

const questions = [
  ...initialQs,
  ...nextjsQs,
  ...sanityQs,
  ...themeQs(chalkPipe)
];

module.exports = async () => {
  const nfd = 'newfrontdoor';

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

  const orgname = await answers.orgname;
  const orgnameKebab = await utility.toKebabCase(answers.orgname);
  const orgurl = await answers.url;

  console.log(
    'Creating a new project for ' +
      orgname +
      ' (' +
      `${orgurl || orgnameKebab}` +
      ')'
  );

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
      .catch((error) => {
        console.log(error);
      });
    factory.createNextApp({execa, repo});
  }

  if (answers.scaffold.includes('Sanity')) {
    const repo = factory.createRepo({
      nfd,
      octokit,
      orgname,
      orgurl,
      orgnameKebab,
      type: 'Sanity'
    });
    factory.createSanity({execa, repo, orgname, orgnameKebab});
  }
};
