const createNextApp = ({execa, repo}) => {
  const [reponame, url] = repo;
  process.chdir('../');
  execa.sync('npx', [
    'create-next-app',
    '-e',
    'https://github.com/NewFrontDoor/nfd-nextjs-starter',
    reponame
  ]);
  process.chdir(reponame);
  execa('git', ['remote', 'add', 'origin', url]);
  execa('git', ['push', '-u', 'origin', 'master']);
};

const createSanity = ({execa, repo, orgname, orgnameKebab}) => {
  // TODO: add committing to newly created repo
  console.log('Creating Sanity Project');
  execa('sanity', [
    'init',
    '-y',
    '--dataset',
    'production',
    '--output-path',
    `../${orgnameKebab}-sanity`,
    '--create-project',
    `${orgname}`
  ]).stdout.pipe(process.stderr);
};

const createRepo = async ({
  nfd,
  octokit,
  orgname,
  orgurl,
  orgnameKebab,
  type
}) => {
  const reponame =
    type === 'NextJS'
      ? orgurl || `${orgnameKebab}-nextjs`
      : `${orgnameKebab}-sanity`;
  const response = await octokit.repos
    .createInOrg({
      org: nfd,
      name: reponame,
      private: true,
      description: `${type} project for ${orgname}, build by New Front Door`
    })
    .catch((error) => {
      console.log(error);
    });
  return [reponame, response.data.clone_url];
};

module.exports = {createNextApp, createSanity, createRepo};
