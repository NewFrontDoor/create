#!/usr/bin/env node
'use strict';
const meow = require('meow');
const boxen = require('boxen');
const checkTools = require('./lib/check-tools');
const askQuestions = require('./lib/ask-questions');
const createProject = require('./lib/project');

const createNFD = require('.');

const cli = meow(
  `
	Usage
    $ nfd <orgname>

	Options
    --url, -u        Define a url
    --next, -n       Initialise NextJS
    --sanity, -s     Initialise Sanity
    --theme, -t      Initialise theme files with automated defaults
    --extended, -e   Install NewFrontDoor UI library elements
    
    --dry, -d        Dry run

	Examples
    $ nfd "Sample church" --next --url sample.church
      
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
      dry: {
        type: 'boolean',
        alias: 'd'
      },
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

console.clear();
console.log(boxen('Welcome to the Create project for NFD', {padding: 1}));

// Run index.js
checkTools()
  .then(() => askQuestions(cli.input[0], cli.flags))
  .then(createProject)
  .then(createNFD);
