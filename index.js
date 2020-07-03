'use strict';
const execa = require('execa');
// Const hasYarn = require('has-yarn'); - add later once actually installing packages
const chalk = require('chalk');
const chalkPipe = require('chalk-pipe');
const inquirer = require('inquirer');
const config = require('./config');
const fs = require('fs');

const Spinners = require('spinnies');

const {initialQs, nextjsQs, sanityQs, themeQs} = require('./lib/questions');
const {
  toKebabCase,
  createPackageJson,
  createGitIgnore
} = require('./lib/utility');
const factory = require('./lib/factories');
const {generatePalette} = require('./lib/factories');
const {stdout} = require('process');

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
  console.clear();

  const spinnies = new Spinners();
  const answers = await inquirer.prompt(questions).catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });

  const factoryProps = {
    execa,
    palette: await generatePalette(answers),
    githubOrg: config.githubOrg,
    orgname: await answers.orgname,
    orgnameKebab: await toKebabCase(answers.orgname),
    orgurl: await answers.url,
    wantsUI: await answers.standard_ui,
    spinnies
  };

  console.log(
    'Creating a new project for ' +
      factoryProps.orgname +
      ' (' +
      `${factoryProps.orgurl || factoryProps.orgnameKebab}` +
      ')'
  );

  spinnies.add('projectrepo', {
    text: 'Creating project repo',
    color: 'greenBright'
  });

  if (answers.scaffold.includes('Sanity')) {
    spinnies.add('sanityproject', {
      text: 'Create Sanity project',
      color: 'greenBright'
    });
  }

  if (answers.scaffold.includes('NextJS')) {
    spinnies.add('nextapp', {
      text: 'Create NextJS app',
      color: 'greenBright'
    });
  }

  spinnies.add('projectgithub', {
    text: 'Push project to github',
    color: 'greenBright'
  });

  fs.mkdirSync(factoryProps.orgnameKebab, (err) => {
    if (err) throw err;
  });
  process.chdir(factoryProps.orgnameKebab);
  fs.writeFile('package.json', createPackageJson(), (err) => {
    if (err) throw err;
    console.log('Created package.json');
  });
  fs.writeFile('.gitignore', createGitIgnore(), (err) => {
    if (err) throw err;
    console.log('Created .gitignore');
  });

  await execa('git', ['init']);

  await factory
    .createRepo({
      ...factoryProps
    })
    .then((result) => {
      spinnies.succeed('projectrepo', {
        text: 'Project GitHub repo created!',
        color: 'greenBright'
      });
      return result;
    })
    .catch((error) => {
      spinnies.fail('projectrepo', {
        text: 'Project GitHub repo creation failed',
        color: 'redBright'
      });
      console.log(error);
      process.exit(1);
    });

  // If opted for Sanity, create a Sanity repo
  if (answers.scaffold.includes('Sanity')) {
    await factory.createSanity({
      ...factoryProps
    });
  }

  // If opted for NextJS, create a NextJS repo
  if (answers.scaffold.includes('NextJS')) {
    await factory.createNextApp({...factoryProps});
  }

  await spinnies.update('projectgithub', {
    text: 'Pushing files to GitHub...',
    color: 'greenBright'
  });

  await execa('git', ['push', '-u', 'origin', 'master']);

  await spinnies.succeed('projectrepo', {
    text: 'Project committed to GitHub!',
    color: 'greenBright'
  });
};
