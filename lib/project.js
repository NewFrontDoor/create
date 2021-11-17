const path = require('path');
const execa = require('execa');
const {writeFile} = require('fs').promises;

const config = require('./config');
const createSanity = require('./sanity');
const createNextApp = require('./next');
const projectOptions = require('./project-options');
const f = require('./factories');
const u = require('./utility');

async function createProject({cwd, ...answers}) {
  const options = {
    cwd,
    palette: await f.generatePalette(answers),
    githubOrg: config.githubOrg,
    orgname: await answers.orgname,
    orgurl: await answers.url,
    wantsUI: await answers.standard_ui
  };

  return {
    sanity: createSanity(options),
    nextjs: createNextApp(options),

    ...answers,
    ...options,
    ...projectOptions(options),

    createProjectDirectory() {
      return execa('git', ['init', this.projectName], {cwd});
    },

    writeFile(file, data) {
      return writeFile(path.join(this.projectDir, file), data);
    },

    async writePackageJSON() {
      const packageJson = JSON.stringify(
        {
          private: true,
          name: this.projectName,
          workspaces: ['next-js', 'sanity'],
          scripts: {},
          dependencies: {}
        },
        null,
        2
      );
      await this.writeFile('package.json', packageJson);
      return execa('yarn', ['add', '-DW', '@sanity/cli'], {
        cwd: this.projectDir
      });
    },

    writeGitIgnore() {
      return this.writeFile('.gitignore', u.gitIgnore);
    },

    async createSanity() {
      return this.sanity.create();
    },

    async createNextApp() {
      return this.nextjs.create();
    },

    async createRepo() {
      // @TODO account for instance where repo-name already exists.
      // Probably need to lookup repo name before calling createInOrg and either:
      // 1. Setting a different name with a prefix/suffix
      // 2. Prompting a new name for the project
      // 3. Warning about overwriting etc.

      const reponame = this.projectName;
      const {orgname} = this;
      const {githubOrg} = config;

      await execa(
        'gh',
        [
          'repo',
          'create',
          `${githubOrg}/${reponame}`,
          '-d',
          `Project for ${orgname}, built by New Front Door`,
          '>/dev/null'
        ],
        {cwd: this.projectDir}
      );

      return [reponame, `https://github.com/${githubOrg}/${reponame}.git`];
    },

    push() {
      return this.execa('git', ['push', '-u', 'origin', 'main'], {
        cwd: this.projectDir
      });
    }
  };
}

module.exports = createProject;
