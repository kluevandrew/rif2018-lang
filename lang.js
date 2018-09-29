#!/usr/bin/env node

// Trust me, i am engineer

const util = require('util');
const fs = require('fs');
const lexer = require('./lib/lexer');
const parser = require('./lib/parser');
const compiler = require('./lib/compiler');
const interpreter = require('./lib/interpreter');
const optimizer = require('./lib/optimizer');

const code = fs.readFileSync(process.argv[2]).toString();

console.log("============== tokens ================");
const tokens = lexer.tokenize(code);
console.log(util.inspect(tokens));
console.log("==============================");


console.log("=============== ast ===============");
const ast = parser.parse(tokens);
console.log(util.inspect(ast, { depth: null }));
console.log("==============================");

console.log("============== Opcodes ================");
const opcodes = compiler.compile(ast);
console.log(util.inspect(opcodes, { depth: null }));
console.log("==============================");

console.log("================ optimizedOpcodes ==============");
const optimizedOpcodes = optimizer.optimize(opcodes);
console.log(util.inspect(optimizedOpcodes, { depth: null }));
console.log("==============================");

const result = interpreter.execute(optimizedOpcodes);
