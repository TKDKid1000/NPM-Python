#!/usr/bin/env node

const {command} = require("../build/index")

command.parse(process.argv.slice(2))