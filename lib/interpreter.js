const {OPCODE_TYPE} = require("./opcode");

class Stack {
    constructor() {
        this.array = [];
    }

    push(value) {
        this.array.push(value);
    }

    pop() {
        return this.array.pop();
    }
}

class Scope {
    constructor(parent) {
        this.storage = {};
        this.parent = parent;
    }

    get(key) {
        if (!this.has(key) && this.parent) {
            return this.parent.get(key);
        }

        return this.storage[key];
    }

    set(key, value) {
        this.storage[key] = value;
    }

    has(key) {
        return key in this.storage;
    }
}

class Interpreter {
    constructor(opcodes) {
        this.opcodes = opcodes;
        this.position = 0;
        this.stack = new Stack();
        this.scope = new Scope();

        this.scope.set('print', function (a) {
            console.log(a);
        });
    }

    execute() {
        while (true) {
            const opcode = this.opcodes[this.position];
            if (!opcode) {
                break;
            }
            // console.log(opcode);
            switch (opcode.type) {
                case OPCODE_TYPE.LOAD_CONST:
                    this.evalLoadConst(opcode);
                    break;
                case OPCODE_TYPE.STORE:
                    this.evalStore(opcode);
                    break;
                case OPCODE_TYPE.LOAD_FAST:
                    this.evalLoadFast(opcode);
                    break;
                case OPCODE_TYPE.BINARY_ADD:
                    this.evalBinaryAdd(opcode);
                    break;
                case OPCODE_TYPE.BINARY_REM:
                    this.evalBinaryRem(opcode);
                    break;
                case OPCODE_TYPE.BINARY_MUL:
                    this.evalBinaryMul(opcode);
                    break;
                case OPCODE_TYPE.BINARY_DIV:
                    this.evalBinaryDiv(opcode);
                    break;
                case OPCODE_TYPE.CALL:
                    this.evalCall(opcode);
                    break;
                case OPCODE_TYPE.POP_TOP:
                    this.evalPopTop(opcode);
                    break;
                default:
                    throw new Error(`Unexpected opcode ${opcode.type}`)
            }
            // console.log(this.stack);
            // console.log(this.scope);
        }

        return 0;
    }

    evalLoadConst(opcode) {
        this.stack.push(opcode.value);
        this.position++;
    }

    evalStore(opcode) {
        let name = opcode.value;
        let value = this.stack.pop();
        this.scope.set(name, value);
        this.position++;
    }

    evalLoadFast(opcode) {
        let value = this.scope.get(opcode.value);
        this.stack.push(value);
        this.position++;
    }

    evalBinaryAdd(opcode) {
        let left = this.stack.pop();
        let right = this.stack.pop();

        let result = left + right;
        this.stack.push(result);
        this.position++;
    }

    evalBinaryRem(opcode) {
        let left = this.stack.pop();
        let right = this.stack.pop();

        let result = left - right;
        this.stack.push(result);
        this.position++;
    }

    evalBinaryMul(opcode) {
        let left = this.stack.pop();
        let right = this.stack.pop();

        let result = left * right;
        this.stack.push(result);
        this.position++;
    }

    evalBinaryDiv(opcode) {
        let left = this.stack.pop();
        let right = this.stack.pop();

        let result = left / right;
        this.stack.push(result);
        this.position++;
    }

    evalCall(opcode) {
        let func = this.stack.pop();
        let args = [];
        for (var i = 0; i < opcode.value; i++) {
            args.push(this.stack.pop());
        }
        let result = func(...args);
        this.stack.push(result);
        this.position++;
    }

    evalPopTop(opcode) {
        this.stack.pop();
        this.position++;
    }

}


module.exports = {
    execute: function (opcodes) {
        const interpreter = new Interpreter(opcodes);
        return interpreter.execute();
    },
};