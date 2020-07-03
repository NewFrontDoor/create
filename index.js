'use strict';
const execa = require('execa');
// Const hasYarn = require('has-yarn'); - add later once actually installing packages
const chalk = require('chalk');
const chalkPipe = require('chalk-pipe');
const inquirer = require('inquirer');
const config = require('./config');

const Spinners = require('spinnies');

const {initialQs, nextjsQs, sanityQs, themeQs} = require('./lib/questions');
const {toKebabCase} = require('./lib/utility');
const factory = require('./lib/factories');
const {generatePalette} = require('./lib/factories');

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
  let palette;
  // CLI query function - get all the details!!
  const answers = await inquirer.prompt(questions).catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });

  const factoryProps = {
    // Set the org name for accessing github
    githubOrg: config.githubOrg,
    // Orgname here refers to the client church/organisation
    orgname: await answers.orgname,
    orgnameKebab: await toKebabCase(answers.orgname),
    orgurl: await answers.url
  };

  console.clear();

  console.log(
    'Creating a new project for ' +
      factoryProps.orgname +
      ' (' +
      `${factoryProps.orgurl || factoryProps.orgnameKebab}` +
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

  // If opted for Theme, create a colour scheme
  if (answers.scaffold.includes('Theme')) {
    if (
      ['NextJS', 'Sanity'].some((match) => answers.scaffold.includes(match))
    ) {
      palette = await generatePalette(answers);
    } else {
      console.log('Generated a palette:');
      console.log(await generatePalette(answers));
    }
  }

  // If opted for NextJS, create a NextJS repo
  if (answers.scaffold.includes('NextJS')) {
    const repo = await factory
      .createRepo({
        ...factoryProps,
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
    factory.createNextApp({execa, repo, spinnies, palette});
  }

  // If opted for Sanity, create a Sanity repo
  if (answers.scaffold.includes('Sanity')) {
    const repo = await factory
      .createRepo({
        ...factoryProps,
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
    factory.createSanity({
      execa,
      repo,
      orgname: factoryProps.orgname,
      spinnies,
      palette
    });
  }
};
