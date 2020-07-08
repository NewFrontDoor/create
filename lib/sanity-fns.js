const fs = require('fs');

const buildOutSanity = ({cwd, palette}) => {
  const array = [
    ['dashboardfeed.js', dashboardfeed],
    ['dashboardconfig.js', dashboardconfig],
    ['variableOverrides.css', variableoverrides({palette})]
  ];

  for (const item of array) {
    fs.writeFile(cwd + item[0], item[1], (err) => {
      if (err) throw err;
    });
  }
};

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

module.exports = {buildOutSanity};
