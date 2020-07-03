const execa = require('execa');
const fetch = require('node-fetch');
const {hexToDec, decToHex} = require('./utility');
const stringifyObject = require('stringify-object');
const fs = require('fs');

const createNextApp = async ({execa, repo, spinnies, palette}) => {
  const colorFile = `const baseColors = ${stringifyObject(palette, {
    indent: '  '
  })};
  
  export default {
    ...baseColors,
    // This is a workaround for consuming our own defined values
    active: baseColors.accent
  };

  `;
  // @TODO Handle case where NextJS repo already exists
  const [reponame, url] = repo;
  const cwd = reponame;
  spinnies.update('nextapp', {
    text: 'NextJS app initialising...',
    color: 'greenBright'
  });
  await execa('npx', [
    'create-next-app',
    '-e',
    'https://github.com/NewFrontDoor/nfd-nextjs-starter',
    reponame
  ]);

  fs.writeFileSync(
    `${process.cwd()}/${reponame}/theme/colors.js`,
    colorFile,
    (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    }
  );

  await execa('git', ['add', '.'], {cwd});
  await execa('git', ['commit', '-m', '"Adding generated colour-scheme"'], {
    cwd
  });

  await spinnies.succeed('nextapp', {
    text: 'NextJS initialisation complete!',
    color: 'greenBright'
  });
  await spinnies.update('pushnextjs', {
    text: 'Pushing project to GitHub...',
    color: 'greenBright'
  });
  await execa('git', ['remote', 'add', 'origin', url], {cwd});
  await execa('git', ['push', '-u', 'origin', 'master'], {cwd});

  await spinnies.succeed('pushnextjs', {
    text: 'NextJS project successfully committed to GitHub!',
    color: 'greenBright'
  });
};

const createSanity = async ({execa, repo, orgname, spinnies, palette}) => {
  // @TODO Handle case where sanity repo already exists
  const [reponame, url] = repo;
  const cwd = reponame;
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
    reponame,
    '--create-project',
    `${orgname}`
  ]);

  await spinnies.succeed('sanityproject', {
    text: 'Sanity project initialisation complete!',
    color: 'greenBright'
  });
  await spinnies.update('pushsanity', {
    text: 'Pushing project to GitHub...',
    color: 'greenBright'
  });

  await execa('git', ['init'], {cwd});
  await execa('git', ['add', '.'], {cwd});
  await execa('git', ['commit', '-m', '"Initial Sanity commit"'], {cwd});
  await execa('git', ['remote', 'add', 'origin', url], {cwd});
  await execa('git', ['push', '-u', 'origin', 'master'], {cwd});
  await spinnies.succeed('pushsanity', {
    text: 'Sanity project successfully committed to GitHub!',
    color: 'greenBright'
  });
};

const createRepo = async ({githubOrg, orgname, orgurl, orgnameKebab, type}) => {
  // @TODO account for instance where repo-name already exists.
  // Probably need to lookup repo name before calling createInOrg and either:
  // 1. Setting a different name with a prefix/suffix
  // 2. Prompting a new name for the project
  // 3. Warning about overwriting etc.

  const reponame =
    type === 'NextJS'
      ? orgurl || `${orgnameKebab}-nextjs`
      : `${orgnameKebab}-sanity`;

  execa('gh', [
    'repo',
    'create',
    `${githubOrg}/${reponame}`,
    '-d',
    `${type} project for ${orgname}, built by New Front Door`,
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
