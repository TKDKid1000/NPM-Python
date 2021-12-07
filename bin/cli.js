#!/usr/bin/env node

const {command} = require("./cli/bin/index")

command.parse(process.argv.slice(2))