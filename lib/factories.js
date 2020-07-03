const execa = require('execa');
const fetch = require('node-fetch');
const {hexToDec, decToHex, nextColorFile} = require('./utility');
const fs = require('fs');

const createNextApp = async ({execa, spinnies, palette, wantsUI}) => {
  // @TODO Handle case where NextJS repo already exists

  spinnies.update('nextapp', {
    text: 'NextJS app initialising...',
    color: 'greenBright'
  });
  await execa('npx', [
    'create-next-app',
    '-e',
    'https://github.com/NewFrontDoor/nfd-nextjs-starter',
    'next-js'
  ]);

  fs.writeFileSync(
    `${process.cwd()}/next-js/theme/colors.js`,
    nextColorFile(palette),
    (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    }
  );

  await execa('git', ['add', '.'], {cwd: process.cwd()});
  await execa('git', ['commit', '-m', 'Update theme'], {cwd: process.cwd()});

  if (wantsUI) {
    await execa('yarn', [
      'add',
      '@newfrontdoor/form',
      '@newfrontdoor/sermon',
      '@newfrontdoor/sanity-block-components',
      '@newfrontdoor/search',
      '@newfrontdoor/calendar',
      '@newfrontdoor/location-map',
      '-W'
    ]);

    await execa('git', ['add', '.'], {cwd: process.cwd()});
    await execa('git', ['commit', '-m', 'Adding core UI components'], {cwd: process.cwd()});
  }

  await spinnies.succeed('nextapp', {
    text: 'NextJS initialisation complete!',
    color: 'greenBright'
  });
};

const createSanity = async ({
  execa,
  orgname,
  spinnies,
  palette
}) => {
  // @TODO Handle case where sanity repo already exists
  spinnies.update('sanityproject', {
    text: 'Sanity project initialising...',
    color: 'greenBright'
  });
  await execa('sanity', [
    'init',
    '-y',
    '--dataset',
    'production',
    '--output-path',
    'sanity',
    '--create-project',
    orgname
  ]);

  await spinnies.succeed('sanityproject', {
    text: 'Sanity project initialisation complete!',
    color: 'greenBright'
  });

  await execa('git', ['add', '.'], {cwd: process.cwd()});
  await execa('git', ['commit', '-m', 'Initial Sanity commit'], {
    cwd: process.cwd()
  });
};

const createRepo = async ({githubOrg, orgname, orgurl, orgnameKebab}) => {
  // @TODO account for instance where repo-name already exists.
  // Probably need to lookup repo name before calling createInOrg and either:
  // 1. Setting a different name with a prefix/suffix
  // 2. Prompting a new name for the project
  // 3. Warning about overwriting etc.

  const reponame = orgurl || orgnameKebab;

  execa('gh', [
    'repo',
    'create',
    `${githubOrg}/${reponame}`,
    '-d',
    `Project for ${orgname}, built by New Front Door`,
    '>/dev/null'
  ]);
  return [reponame, `https://github.com/${githubOrg}/${reponame}.git`];
};

const generatePalette = async (answers) => {
  const body = {
    model: 'ui',
    input: [
      hexToDec(answers.color_background),
      hexToDec(answers.color_accent),
      hexToDec(answers.color_primary),
      hexToDec(answers.color_muted),
      hexToDec(answers.color_text)
    ]
  };

  const colours = await fetch('http://colormind.io/api/', {
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then((result) => {
      return result.json();
    })
    .then((object) => {
      return decToHex(object.result);
    });

  const palette = {
    background: colours[0],
    accent: colours[1],
    primary: colours[2],
    muted: colours[3],
    text: colours[4]
  };

  return palette;
};

module.exports = {createNextApp, createSanity, createRepo, generatePalette};
