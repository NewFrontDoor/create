const dependencies = [
  '@newfrontdoor/form',
  '@newfrontdoor/sermon',
  '@newfrontdoor/sanity-block-components',
  '@newfrontdoor/search',
  '@newfrontdoor/calendar',
  '@newfrontdoor/location-map'
];

const parts = [
  {
    implements: 'part:@sanity/dashboard/config',
    path: './dashboardConfig.js'
  },
  {
    implements: 'part:@sanity/base/theme/variables/override-style',
    path: 'variableOverrides.css'
  }
];

module.exports = {dependencies, parts};
