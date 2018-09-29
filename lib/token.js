class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    getPriority()
    {
        switch (this.type) {
            case TOKEN_TYPE.MULTIPLY:
            case TOKEN_TYPE.DIVIDE:
                return 20;
            case TOKEN_TYPE.PLUS:
            case TOKEN_TYPE.MINUS:
                return 10;
            default:
                return 0;
        }
    }

}

const TOKEN_TYPE = {
    NUMBER: 'T_NUMBER',
    ID: 'T_ID',
    OPEN_PAREN: 'T_OPEN_PAREN',
    OPEN_CURLY: 'T_OPEN_CURLY',
    CLOSE_PAREN: 'T_CLOSE_PAREN',
    CLOSE_CURLY: 'T_CLOSE_CURLY',
    PLUS: 'T_PLUS',
    MINUS: 'T_MINUS',
    MULTIPLY: 'T_MULTIPLY',
    DIVIDE: 'T_DIVIDE',
    SEMICOLON: 'T_SEMICOLON',
    VAR: 'T_VAR',
    ASSIGN: 'T_ASSIGN',
    COMMA: 'T_COMMA',
    IF: "T_IF",
    ELSEIF: "T_ELSEIF",
    ELSE: "T_ELSE",
    GT: "T_GT",
    GTE: "T_GTE",
    LT: "T_LT",
    LTE: "T_LTE",
    EQUALS: "T_EQ",
    EOF: 'T_EOF',
};

module.exports = {
    Token,
    TOKEN_TYPE
};