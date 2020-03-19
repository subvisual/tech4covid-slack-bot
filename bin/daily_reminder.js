#!/bin/node

const parse = require('csv-parse');
const fs = require('fs');

const input = fs.readFileSync(process.argv[2]);

const records = parse(input, {columns: true, skip_empty_lines: true});

console.log(records);
