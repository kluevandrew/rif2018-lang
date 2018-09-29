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
                case OPCODE_TYPE.BINARY_GT:
                    this.evalBinaryGt(opcode);
                    break;
                case OPCODE_TYPE.BINARY_GTE:
                    this.evalBinaryGte(opcode);
                    break;
                case OPCODE_TYPE.BINARY_LT:
                    this.evalBinaryLt(opcode);
                    break;
                case OPCODE_TYPE.BINARY_LTE:
                    this.evalBinaryLte(opcode);
                    break;
                case OPCODE_TYPE.BINARY_EQ:
                    this.evalBinaryEq(opcode);
                    break;
                case OPCODE_TYPE.CALL:
                    this.evalCall(opcode);
                    break;
                case OPCODE_TYPE.POP_TOP:
                    this.evalPopTop(opcode);
                    break;
                case OPCODE_TYPE.JUMP_IF_FALSE:
                    this.evalJumpIfFalse(opcode);
                    break;
                case OPCODE_TYPE.JUMP_IF_TRUE:
                    this.evalJumpIfTrue(opcode);
                    break;
                case OPCODE_TYPE.JUMP:
                    this.evalJump(opcode);
                    break;
                case OPCODE_TYPE.CALL_USER:
                    this.evalCallUser(opcode);
                    break;
                case OPCODE_TYPE.DECLARE_FUNC:
                    this.evalDeclareFunc(opcode);
                    break;
                case OPCODE_TYPE.RETURN:
                    return this.evalReturn(opcode);
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

    evalBinaryGt(opcode) {
        let left = this.stack.pop();
        let right = this.stack.pop();

        let result = left > right ? 1 : 0;
        this.stack.push(result);
        this.position++;
    }

    evalBinaryGte(opcode) {
        let left = this.stack.pop();
        let right = this.stack.pop();

        let result = left >= right ? 1 : 0;
        this.stack.push(result);
        this.position++;
    }

    evalBinaryLt(opcode) {
        let left = this.stack.pop();
        let right = this.stack.pop();

        let result = left < right ? 1 : 0;
        this.stack.push(result);
        this.position++;
    }

    evalBinaryLte(opcode) {
        let left = this.stack.pop();
        let right = this.stack.pop();

        let result = left <= right ? 1 : 0;
        this.stack.push(result);
        this.position++;
    }

    evalBinaryEq(opcode) {
        let left = this.stack.pop();
        let right = this.stack.pop();

        let result = left === right ? 1 : 0;
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

    evalJumpIfFalse(opcode) {
        const value = this.stack.pop();
        if (value === 0) {
            this.position += opcode.value;
        } else {
            this.position++;
        }
    }

    evalJumpIfTrue(opcode) {
        const value = this.stack.pop();
        if (value === 1) {
            this.position += opcode.value;
        } else {
            this.position++;
        }
    }

    evalJump(opcode) {
        this.position += opcode.value;
    }

    evalCallUser(opcode) {
        let userFunc = this.stack.pop();
        let args = [];
        for (let i = 0; i < opcode.value; i++) {
            args.push(this.stack.pop());
        }

        const interpreter = new Interpreter(this.opcodes);
        interpreter.position = userFunc.address;
        interpreter.stack = this.stack;
        interpreter.scope = new Scope(this.scope);
        let i = 0;
        for (let argName of userFunc.argsNames) {
            interpreter.scope.set(argName, args[i]);
            i++;
        }

        const result = interpreter.execute();
        this.stack.push(result);
        this.position++;
    }

    evalDeclareFunc(opcode) {
        const name = this.stack.pop();
        const address = this.stack.pop();
        const argNames = [];
        for (let i = 0; i < opcode.value; i++) {
            argNames.push(this.stack.pop());
        }

        const userFunction = new UserFunction(address, argNames);
        this.scope.set(name, userFunction);
        this.position++;
    }

    evalReturn(opcode) {
        return this.stack.pop();
    }

}

class UserFunction {
    constructor(address, argsNames) {
        this.address = address;
        this.argsNames = argsNames;
    }
}

module.exports = {
    execute: function (opcodes) {
        const interpreter = new Interpreter(opcodes);
        return interpreter.execute();
    },
};