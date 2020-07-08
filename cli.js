#!/usr/bin/env node
'use strict';
const meow = require('meow');
const createNFD = require('.');

const cli = meow(
  `
	Usage
	  $ nfd <orgname>

	Options
      --url, -u  Define a url
      --next, -n Initialise NextJS
      --sanity, -s Initialise Sanity
      --theme, -t Initialise theme files with automated defaults
      --extended, -e Install NewFrontDoor UI library elements

	Examples
      $ nfd "Sample church" -nest -u sample.church
      
    Sample church
    {
        next: true,
        extended: true,
        sanity: true,
        theme: true,
        url: 'sample.church'
    }
`,
  {
    flags: {
      url: {
        type: 'string',
        alias: 'u'
      },
      next: {
        type: 'boolean',
        alias: 'n'
      },
      sanity: {
        type: 'boolean',
        alias: 's'
      },
      theme: {
        type: 'boolean',
        alias: 't'
      },
      extended: {
        type: 'boolean',
        alias: 'e'
      }
    }
  }
);
/*
{
	input: ['unicorns'],
	flags: {rainbow: true},
	...
}
*/

// Run index.js
createNFD(cli.input[0], cli.flags);
