#!/usr/bin/env node

// Trust me, i am engineer

const util = require('util');
const fs = require('fs');
const lexer = require('./lib/lexer');
const parser = require('./lib/parser');
const compiler = require('./lib/compiler');
const interpreter = require('./lib/interpreter');

const code = fs.readFileSync(process.argv[2]).toString();


const tokens = lexer.tokenize(code);
console.log(util.inspect(tokens));
console.log("==============================");

const ast = parser.parse(tokens);
console.log(util.inspect(ast, { depth: null }));
console.log("==============================");

const opcodes = compiler.compile(ast);
console.log(util.inspect(opcodes, { depth: null }));
console.log("==============================");

const result = interpreter.execute(opcodes);
