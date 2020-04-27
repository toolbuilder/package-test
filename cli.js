#!/usr/bin/env node
require = require('esm')(module) // eslint-disable-line
module.exports = require('./src/cli-module.js')
