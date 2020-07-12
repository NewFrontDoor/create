const execa = require('execa');
const findVersions = require('find-versions');

async function checkTools() {
  const gh = await checkVersion('gh');
  const git = await checkVersion('git');
  const node = await checkVersion('node');
  const yarn = await checkVersion('yarn');

  return {gh, git, node, yarn};
}

const install = {
  gh: 'Install GitHub cli, https://cli.github.com/',
  git: 'Install git, https://git-scm.com/',
  node: 'Install node, https://nodejs.org/',
  yarn: 'Install yarn, https://classic.yarnpkg.com/'
};

async function checkVersion(command /* version */) {
  // TODO: compare versions
  try {
    const {stdout} = await execa(command, ['--version']);
    const [version] = findVersions(stdout);
    return version;
  } catch {
    throw new Error(install[command]);
  }
}

module.exports = checkTools;
