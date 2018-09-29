const OPCODE_TYPE = {
    'LOAD_CONST': 'LOAD_CONST',
    'STORE': 'STORE',
    'LOAD_FAST': 'LOAD_FAST',
    'BINARY_ADD': 'BINARY_ADD',
    'BINARY_REM': 'BINARY_REM',
    'BINARY_MUL': 'BINARY_MUL',
    'BINARY_DIV': 'BINARY_DIV',
    'BINARY_GT': 'BINARY_GT',
    'BINARY_GTE': 'BINARY_GTE',
    'BINARY_LT': 'BINARY_LT',
    'BINARY_LTE': 'BINARY_LTE',
    'BINARY_EQ': 'BINARY_EQ',
    'JUMP_IF_FALSE': 'JUMP_IF_FALSE',
    'JUMP_IF_TRUE': 'JUMP_IF_TRUE',
    'JUMP': 'JUMP',
    'CALL': 'CALL',
    'CALL_USER': 'CALL_USER',
    'DECLARE_FUNC': 'DECLARE_FUNC',
    'RETURN': 'RETURN',
    'GOTO': 'GOTO',
    'POP_TOP': 'POP_TOP',
};

class Opcode {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

module.exports = {
    Opcode,
    OPCODE_TYPE,
};