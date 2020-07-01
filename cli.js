#!/usr/bin/env node
'use strict';
require('dotenv').config();
const arrExclude = require('arr-exclude');
const createNFD = require('.');

const cli = process.argv.slice(2);
const args = arrExclude(cli, ['--next']);
const next = cli.includes('--next');

// Run index.js
createNFD({args, next});
