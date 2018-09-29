const { Token, TOKEN_TYPE } = require('./token');

const KEYWORDS = {
    "var": TOKEN_TYPE.VAR,
    "if": TOKEN_TYPE.IF,
    "elseif": TOKEN_TYPE.ELSEIF,
    "else": TOKEN_TYPE.ELSE,
    "function": TOKEN_TYPE.FUNCTION,
    "return": TOKEN_TYPE.RETURN,
    "for": TOKEN_TYPE.FOR,
};

const PUNCTUATION = {
    ";": TOKEN_TYPE.SEMICOLON,
    "+": TOKEN_TYPE.PLUS,
    "-": TOKEN_TYPE.MINUS,
    "*": TOKEN_TYPE.MULTIPLY,
    "/": TOKEN_TYPE.DIVIDE,
    "(": TOKEN_TYPE.OPEN_PAREN,
    ")": TOKEN_TYPE.CLOSE_PAREN,
    "=": TOKEN_TYPE.ASSIGN,
    ",": TOKEN_TYPE.COMMA,
    ">":  TOKEN_TYPE.GT,
    ">=":  TOKEN_TYPE.GTE,
    "<":  TOKEN_TYPE.LT,
    "<=":  TOKEN_TYPE.LTE,
    "==":  TOKEN_TYPE.EQUALS,
    "{":  TOKEN_TYPE.OPEN_CURLY,
    "}":  TOKEN_TYPE.CLOSE_CURLY,
};

class Lexer {

    constructor(code) {
        this.code = code;
    }

    tokenize() {
        this.postion = 0;
        this.tokens = [];

        while (this.postion < this.code.length) {
            const char = this.code[this.postion];

            switch (true) {
                case Lexer.isWhitespace(char):
                    this.readWhile(Lexer.isWhitespace);
                    break;
                case Lexer.isNumber(char):
                    let num = this.readWhile(Lexer.isNumber);
                    this.tokens.push(new Token(TOKEN_TYPE.NUMBER, num));
                    break;
                case Lexer.isWordCharacter(char):
                    let value = this.readWhile(function (char) {
                        return Lexer.isWordCharacter(char) || Lexer.isNumber(char);
                    });

                    if (KEYWORDS.hasOwnProperty(value)) {
                        this.tokens.push(new Token(KEYWORDS[value], value));
                    } else {
                        this.tokens.push(new Token(TOKEN_TYPE.ID, value));
                    }
                    break;
                case PUNCTUATION.hasOwnProperty(char):
                    let sign = this.lookahead(1);
                    if (PUNCTUATION.hasOwnProperty(char + sign)) {
                        this.tokens.push(new Token(PUNCTUATION[char + sign], char + sign));
                        this.postion++;
                        this.postion++;
                    } else {
                        this.tokens.push(new Token(PUNCTUATION[char], char));
                        this.postion++;
                    }
                    break;
                default:
                    throw new Error(`Unexpected char ${char};`);
            }

        }

        this.tokens.push(new Token(TOKEN_TYPE.EOF, ''));

        return this.tokens;
    }

    readWhile(test) {
        let value = '';

        while (true) {
            const char = this.code[this.postion];
            if (test(char)) {
                value += char;
                this.postion++;
            } else {
                break;
            }
        }

        return value;
    }

    static isWhitespace(char) {
        return /[ \n]/.test(char);
    }

    static isNumber(char) {
        return /[0-9]/.test(char);
    }

    static isWordCharacter(char) {
        return /[a-zA-Z_]/.test(char);
    }

    lookahead(n) {
        return this.code[this.postion + n];
    }
}

module.exports = {
    tokenize: function (code) {
        const lexer = new Lexer(code);
        return lexer.tokenize();
    }
};