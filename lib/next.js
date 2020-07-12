const path = require('path');
const execa = require('execa');
const {writeFile} = require('fs').promises;

const u = require('./utility');
const projectOptions = require('./project-options');

const {dependencies} = require('../dependencies-list');

function createNextApp(options) {
  return {
    ...options,
    ...projectOptions(options),

    get nextjsDir() {
      return path.resolve(this.projectDir, 'next-js');
    },

    async create() {
      await execa(
        'yarn',
        [
          'create',
          'next-app',
          '-e',
          'https://github.com/NewFrontDoor/nfd-nextjs-starter',
          'next-js'
        ],
        {
          cwd: this.projectDir
        }
      );

      await writeFile(
        path.join(this.nextjsDir, 'theme/colors.js'),
        u.nextColorFile(this.palette),
        (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        }
      );

      await execa('git', ['add', '.'], {cwd: this.projectDir});
      await execa('git', ['commit', '-m', 'Update theme'], {
        cwd: this.projectDir
      });

      if (this.wantsUI) {
        await execa('yarn', ['add', ...dependencies], {
          cwd: this.nextjsDir
        });

        await execa('git', ['add', '.'], {cwd: this.projectDir});
        await execa('git', ['commit', '-m', 'Adding core UI components'], {
          cwd: this.projectDir
        });
      }
    }
  };
}

module.exports = createNextApp;
