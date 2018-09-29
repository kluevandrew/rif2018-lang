const {Opcode, OPCODE_TYPE} = require("./opcode");

class Optimizer {
    constructor(opcodes) {
        this.opcodes = opcodes;
    }

    optimize() {
        this.position = 0;
        while (this.position < this.opcodes.length) {
            let opcode = this.opcodes[this.position];
            if ([
                OPCODE_TYPE.BINARY_ADD,
                OPCODE_TYPE.BINARY_REM,
                OPCODE_TYPE.BINARY_MUL,
                OPCODE_TYPE.BINARY_DIV,
                OPCODE_TYPE.BINARY_GT,
                OPCODE_TYPE.BINARY_GTE,
                OPCODE_TYPE.BINARY_LT,
                OPCODE_TYPE.BINARY_LTE,
                OPCODE_TYPE.BINARY_EQ,
            ].indexOf(opcode.type) !== -1) {
                const left = this.lookbehind(1);
                const right = this.lookbehind(2);

                if (left.type === OPCODE_TYPE.LOAD_CONST
                && right.type === OPCODE_TYPE.LOAD_CONST) {
                    let newValue;
                    switch (opcode.type) {
                        case OPCODE_TYPE.BINARY_ADD:
                            newValue = left.value + right.value;
                            break;
                        case OPCODE_TYPE.BINARY_REM:
                            newValue = left.value - right.value;
                            break;
                        case OPCODE_TYPE.BINARY_MUL:
                            newValue = left.value * right.value;
                            break;
                        case OPCODE_TYPE.BINARY_DIV:
                            newValue = left.value / right.value;
                            break;
                        case OPCODE_TYPE.BINARY_GT:
                            newValue = left.value > right.value ? 1 : 0;
                            break;
                        case OPCODE_TYPE.BINARY_GTE:
                            newValue = left.value >= right.value ? 1 : 0;
                            break;
                        case OPCODE_TYPE.BINARY_LT:
                            newValue = left.value < right.value ? 1 : 0;
                            break;
                        case OPCODE_TYPE.BINARY_LTE:
                            newValue = left.value <= right.value ? 1 : 0;
                            break;
                        case OPCODE_TYPE.BINARY_EQ:
                            newValue = left.value === right.value ? 1 : 0;
                            break;
                    }

                    this.opcodes = [
                        ...this.opcodes.slice(0, this.position - 2),
                        new Opcode(OPCODE_TYPE.LOAD_CONST, newValue),
                        ...this.opcodes.slice(this.position + 1, this.opcodes.length)
                    ];
                    this.position -= 2;
                    break;
                }
            }

            this.position++;
        }

        return this.opcodes;
    }

    lookahead(n) {
        return this.opcodes[this.position + n];
    }

    lookbehind(n) {
        return this.opcodes[this.position - n];
    }
}


module.exports = {
    optimize: function (opcodes) {
        const optimizer = new Optimizer(opcodes);
        return optimizer.optimize();
    }
}