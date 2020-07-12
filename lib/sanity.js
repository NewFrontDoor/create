const path = require('path');
const execa = require('execa');
const {writeFile, readFile} = require('fs').promises;
const projectOptions = require('./project-options');

const {dependencies, parts} = require('../dependencies-list');

function createSanity(options) {
  return {
    ...options,
    ...projectOptions(options),

    get sanityDir() {
      return path.resolve(this.projectDir, 'sanity');
    },

    writeFile(file, data) {
      return writeFile(path.join(this.sanityDir, file), data);
    },

    writeJSON(file, data) {
      return this.writeFile(file, JSON.stringify(data, null, 2));
    },

    async readJSON(file) {
      return JSON.parse(await readFile(path.join(this.sanityDir, file)));
    },

    async create() {
      // @TODO Handle case where sanity repo already exists
      await execa(
        'sanity',
        [
          'init',
          '-y',
          '--dataset',
          'production',
          '--output-path',
          'sanity',
          '--create-project',
          this.orgname
        ],
        {
          preferLocal: true,
          cwd: this.projectDir
        }
      );

      await Promise.all([
        this.writeFile('dashboardfeed.js', dashboardfeed),
        this.writeFile('dashboardconfig.js', dashboardconfig),
        this.writeFile(
          'variableOverrides.css',
          variableoverrides({palette: this.palette})
        )
      ]);

      if (this.wantsUI) {
        await execa('yarn', ['add', ...dependencies], {cwd: this.sanityDir});
        const sanityJson = await this.readJSON('sanity.json');
        sanityJson.plugins = sanityJson.plugins.concat(dependencies);
        sanityJson.parts = sanityJson.parts.concat(parts);
        await this.writeJSON('sanity.json', sanityJson);
      }

      await execa('git', ['add', '.'], {cwd: this.projectDir});
      await execa('git', ['commit', '-m', 'Initial Sanity commit'], {
        cwd: this.projectDir
      });
    }
  };
}

module.exports = createSanity;

const dashboardfeed = `
export const feedSettings = {
    clientConfig: {
      projectId: '1djoy9b9',
      dataset: 'production',
      useCdn: true
    },
    title: 'NFD tutorials',
    queryString: '*[ _type == "feedItem"]'
  };  
`;

const dashboardconfig = `
import {feedSettings} from './dashboardfeed';

export default {
  widgets: [
    {
      name: 'feed-widget',
      options: feedSettings
    },
    {
      name: 'structure-menu',
      layout: {width: 'large', height: 'auto'}
    },
    {
      name: 's3upload',
      layout: {width: 'medium', height: 'auto'}
    }
  ]
};
`;

const variableoverrides = ({palette}) => `
:root {
    --brand-darkest: ${palette.text};
    --brand-lightest: ${palette.background};
    --gray-base: #323232;
    --brand-primary: ${palette.primary};
    --brand-primary--inverted: #fff;
    --brand-secondary: ${palette.accent};
    --brand-secondary--inverted: #00354e;
    --main-navigation-color: ${palette.muted};
    --main-navigation-color--inverted: ${palette.background};
  }  
`;
