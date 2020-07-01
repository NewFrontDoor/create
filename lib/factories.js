const {Octokit} = require('@octokit/rest');

const createNextApp = async ({execa, repo, spinnies}) => {
  // @TODO Handle case where NextJS repo already exists
  const [reponame, url] = repo;
  spinnies.update('nextapp', {
    text: 'NextJS app initialising...',
    color: 'greenBright'
  });
  const createResult = await execa('npx', [
    'create-next-app',
    '-e',
    'https://github.com/NewFrontDoor/nfd-nextjs-starter',
    reponame
  ]);
  if (createResult) {
    process.chdir(reponame);
    spinnies.succeed('nextapp', {
      text: 'NextJS initialisation complete!',
      color: 'greenBright'
    });
    spinnies.update('pushnextjs', {
      text: 'Pushing project to GitHub...',
      color: 'greenBright'
    });
    execa('git', ['remote', 'add', 'origin', url]);
    execa('git', ['push', '-u', 'origin', 'master']);
    process.chdir('../');
    spinnies.succeed('pushnextjs', {
      text: 'NextJS project successfully committed to GitHub!',
      color: 'greenBright'
    });
  }
};

const createSanity = async ({execa, repo, orgname, spinnies}) => {
  // @TODO Handle case where sanity repo already exists
  const [reponame, url] = repo;
  spinnies.update('sanityproject', {
    text: 'Sanity project initialising...',
    color: 'greenBright'
  });
  const createResult = await execa('sanity', [
    'init',
    '-y',
    '--dataset',
    'production',
    '--output-path',
    reponame,
    '--create-project',
    `${orgname}`
  ]);

  if (createResult) {
    process.chdir(reponame);
    spinnies.succeed('sanityproject', {
      text: 'Sanity project initialisation complete!',
      color: 'greenBright'
    });
    spinnies.update('pushsanity', {
      text: 'Pushing project to GitHub...',
      color: 'greenBright'
    });

    // @TODO somehow make this unblocking (remove .sync) but also sequential...
    execa.sync('git', ['init']);
    execa.sync('git', ['add', '.']);
    execa.sync('git', ['commit', '-m', '"Initial Sanity commit"']);
    execa.sync('git', ['remote', 'add', 'origin', url]);
    execa.sync('git', ['push', '-u', 'origin', 'master']);
    process.chdir('../');
    spinnies.succeed('pushsanity', {
      text: 'Sanity project successfully committed to GitHub!',
      color: 'greenBright'
    });
  }
};

const createRepo = async ({
  nfd,
  orgname,
  orgurl,
  orgnameKebab,
  type,
  token
}) => {
  // @TODO account for instance where repo-name already exists.
  // Probably need to lookup repo name before calling createInOrg and either:
  // 1. Setting a different name with a prefix/suffix
  // 2. Prompting a new name for the project
  // 3. Warning about overwriting etc.
  const octokit = new Octokit({auth: token});

  const reponame =
    type === 'NextJS'
      ? orgurl || `${orgnameKebab}-nextjs`
      : `${orgnameKebab}-sanity`;
  const response = await octokit.repos
    .createInOrg({
      org: nfd,
      name: reponame,
      private: true,
      description: `${type} project for ${orgname}, built by New Front Door`
    })
    .catch((error) => {
      console.log(error);
    });
  return [reponame, response.data.clone_url];
};

module.exports = {createNextApp, createSanity, createRepo};
