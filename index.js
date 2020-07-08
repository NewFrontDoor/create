'use strict';
const execa = require('execa');
const chalkPipe = require('chalk-pipe');
const inquirer = require('inquirer');
const config = require('./config');
const fs = require('fs');
const boxen = require('boxen');
const Spinners = require('spinnies');

const q = require('./lib/questions');
const u = require('./lib/utility');
const f = require('./lib/factories');

// This is registering a plugin on the inquirer instance
// for changing colours in terminal based on provided hex values
inquirer.registerPrompt('chalk-pipe', require('inquirer-chalk-pipe'));

// Build up the array of CLI questions
const questions = [
  ...q.initialQs,
  ...q.nextjsQs,
  ...q.sanityQs,
  ...q.themeQs(chalkPipe)
];

module.exports = async () => {
  console.clear();

  console.log(boxen('Welcome to the Create project for NFD', {padding: 1}));

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
    palette: await f.generatePalette(answers),
    githubOrg: config.githubOrg,
    orgname: await answers.orgname,
    orgnameKebab: await u.toKebabCase(answers.orgname),
    orgurl: await answers.url,
    wantsUI: await answers.standard_ui,
    spinnies
  };

  console.log(JSON.stringify(factoryProps));

  console.log(`Creating a new project for ${factoryProps.orgname}`);

  spinnies.add('projectrepo', {
    text: 'Creating project repo',
    color: 'blueBright'
  });

  if (answers.scaffold.includes('Sanity')) {
    spinnies.add('sanityproject', {
      text: 'Create Sanity project',
      color: 'blueBright'
    });
  }

  if (answers.scaffold.includes('NextJS')) {
    spinnies.add('nextapp', {
      text: 'Create NextJS app',
      color: 'blueBright'
    });
  }

  spinnies.add('projectgithub', {
    text: 'Push project to github',
    color: 'blueBright'
  });

  fs.mkdirSync(factoryProps.orgurl || factoryProps.orgnameKebab, (err) => {
    if (err) throw err;
  });
  process.chdir(factoryProps.orgurl || factoryProps.orgnameKebab);
  fs.writeFile(
    'package.json',
    u.packageJson({name: factoryProps.orgurl || factoryProps.orgnameKebab}),
    (err) => {
      if (err) throw err;
      console.log('Created package.json');
    }
  );
  fs.writeFile('.gitignore', u.gitIgnore, (err) => {
    if (err) throw err;
    console.log('Created .gitignore');
  });

  await execa('git', ['init']);

  await f
    .createRepo({...factoryProps})
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
    await f.createSanity({
      ...factoryProps
    });
  }

  // If opted for NextJS, create a NextJS repo
  if (answers.scaffold.includes('NextJS')) {
    await f.createNextApp({...factoryProps});
  }

  await spinnies.update('projectgithub', {
    text: 'Pushing files to GitHub...',
    color: 'yellow',
    status: 'spinning'
  });

  await execa('git', ['push', '-u', 'origin', 'master']);

  await spinnies.succeed('projectgithub', {
    text: 'Project committed to GitHub!',
    color: 'greenBright'
  });
};
