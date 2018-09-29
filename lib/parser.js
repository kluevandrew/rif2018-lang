const AST = require('./ast');
const {TOKEN_TYPE} = require('./token');


class Parser {

    constructor(tokens) {
        this.tokens = tokens;
    }

    parse() {
        this.position = -1;
        this.current = null;
        this.next();

        const statements = this.parseStatements();

        this.assert(TOKEN_TYPE.EOF);
        this.next();

        return new AST.Program(statements);
    }

    parseStatements() {
        const statements = [];
        while (false === this.is(TOKEN_TYPE.EOF)) {
            statements.push(this.parseStatement());
        }

        return statements;
    }

    parseStatement() {
        let statement;
        if (this.is(TOKEN_TYPE.VAR)) {
            statement = this.parseVarDeclarationStatement();
        } else if (this.is(TOKEN_TYPE.IF)) {
            return this.parseIfStatement();
        } else if (this.is(TOKEN_TYPE.FUNCTION)) {
            return this.parseFunctionDeclarationStatement();
        } else if (this.is(TOKEN_TYPE.RETURN)) {
            statement = this.parseReturnStatement();
        } else if (this.is(TOKEN_TYPE.FOR)) {
            return this.parseForStatement();
        } else {
            statement = this.parseExpressionStatement();
        }
        this.assert(TOKEN_TYPE.SEMICOLON);
        this.next();

        return statement;
    }

    parseVarDeclarationStatement() {
        this.assert(TOKEN_TYPE.VAR);
        this.next();

        const name = this.parseIdentifier();

        this.assert(TOKEN_TYPE.ASSIGN);
        this.next();

        const initial = this.parseExpression();

        return new AST.VarDeclarationStatement(name, initial);
    }

    parseIdentifier() {
        this.assert(TOKEN_TYPE.ID);
        const name = this.current.value;
        this.next();

        return new AST.IdentifierExpression(name);
    }

    parseExpression() {
        const left = this.parseUnaryExpression();

        if (this.is(TOKEN_TYPE.ASSIGN)) {
            return this.parseAssignExpression(left)
        }

        return this.parseBinaryExpression(left, -1);
    }

    parseAssignExpression(name) {
        this.assert(TOKEN_TYPE.ASSIGN);
        this.next();

        return new AST.AssignExpression(name, this.parseExpression());
    }

    parseBinaryExpression(left, minPriority) {
        if (false === this.is([
            TOKEN_TYPE.PLUS,
            TOKEN_TYPE.MINUS,
            TOKEN_TYPE.MULTIPLY,
            TOKEN_TYPE.DIVIDE,
            TOKEN_TYPE.GT,
            TOKEN_TYPE.GTE,
            TOKEN_TYPE.LT,
            TOKEN_TYPE.LTE,
            TOKEN_TYPE.EQUALS,
        ])) {
            return left;
        }

        const priority = this.current.getPriority();
        if (priority > minPriority) {
            const op = this.current.value;
            this.next();
            const right = this.parseBinaryExpression(this.parseUnaryExpression(), priority);

            return this.parseBinaryExpression(
                new AST.BinaryExpression(left, op, right),
                minPriority
            )
        }

        return left;
    }

    parseUnaryExpression() {
        if (this.is(TOKEN_TYPE.NUMBER)) {
            return this.parseLiteralExpression();
        } else if (this.is(TOKEN_TYPE.OPEN_PAREN)) {
            return this.parseParenthesesExpression();
        } else {
            const name = this.parseIdentifier();
            if (this.is(TOKEN_TYPE.OPEN_PAREN)) {
                return this.parseCallExpression(name);
            }

            return name;
        }
    }

    parseParenthesesExpression()
    {
        this.assert(TOKEN_TYPE.OPEN_PAREN);
        this.next();

        const expr = this.parseExpression();

        this.assert(TOKEN_TYPE.CLOSE_PAREN);
        this.next();

        return new AST.ParenthesesExpression(expr);
    }

    parseCallExpression(name) {
        const args = [];
        this.assert(TOKEN_TYPE.OPEN_PAREN);
        this.next();

        if (false === this.is(TOKEN_TYPE.CLOSE_PAREN)) {
            while (true) {
                let arg = this.parseExpression();
                args.push(arg);

                if (false === this.is(TOKEN_TYPE.COMMA)) {
                    break;
                }  else {
                    this.next();
                }
            }
        }

        this.assert(TOKEN_TYPE.CLOSE_PAREN);
        this.next();

        return new AST.CallExpression(name, args);
    }

    parseLiteralExpression()
    {
        this.assert(TOKEN_TYPE.NUMBER);
        let value = parseInt(this.current.value);
        this.next();

        return new AST.LiteralExpression(value);
    }

    parseExpressionStatement() {
        let expr = this.parseExpression();

        return new AST.ExpressionStatement(expr);
    }

    parseIfStatement() {
        this.assert([TOKEN_TYPE.IF, TOKEN_TYPE.ELSEIF]);
        this.next();

        const clause = this.parseExpression();

        this.assert(TOKEN_TYPE.OPEN_CURLY);
        this.next();

        const trueStatements = [];
        while (true) {
            if (this.is(TOKEN_TYPE.CLOSE_CURLY)) {
                break;
            }
            trueStatements.push(this.parseStatement());
        }
        this.assert(TOKEN_TYPE.CLOSE_CURLY);
        this.next();

        if (this.is(TOKEN_TYPE.ELSEIF)) {
            return new AST.IfStatement(clause, trueStatements, [this.parseIfStatement()]);
        }

        const falseStatements = [];
        if (this.is(TOKEN_TYPE.ELSE)) {
            this.next();
            this.assert(TOKEN_TYPE.OPEN_CURLY);
            this.next();

            while (true) {
                if (this.is(TOKEN_TYPE.CLOSE_CURLY)) {
                    break;
                }
                falseStatements.push(this.parseStatement());
            }

            this.assert(TOKEN_TYPE.CLOSE_CURLY);
            this.next();
        }

        return new AST.IfStatement(clause, trueStatements, falseStatements);
    }

    parseFunctionDeclarationStatement() {
        this.assert(TOKEN_TYPE.FUNCTION);
        this.next();

        const name = this.parseIdentifier();

        this.assert(TOKEN_TYPE.OPEN_PAREN);
        this.next();

        const argsNames = [];

        if (false === this.is(TOKEN_TYPE.CLOSE_PAREN)) {
            while (true) {
                argsNames.push(this.parseIdentifier());
                if (false === this.is(TOKEN_TYPE.COMMA)) {
                    break;
                } else {
                    this.next();
                }
            }
        }

        this.assert(TOKEN_TYPE.CLOSE_PAREN);
        this.next();

        this.assert(TOKEN_TYPE.OPEN_CURLY);
        this.next();

        const bodyStatements = [];
        while (true) {
            if (this.is(TOKEN_TYPE.CLOSE_CURLY)) {
                break;
            }
            bodyStatements.push(this.parseStatement());
        }

        this.assert(TOKEN_TYPE.CLOSE_CURLY);
        this.next();

        return new AST.FunctionDeclarationStatement(name, argsNames, bodyStatements);
    }

    parseReturnStatement() {
        this.assert(TOKEN_TYPE.RETURN);
        this.next();

        return new AST.ReturnStatement(this.parseExpression());
    }

    parseForStatement() {
        this.assert(TOKEN_TYPE.FOR);
        this.next();

        this.assert(TOKEN_TYPE.OPEN_PAREN);
        this.next();

        const init = this.parseVarDeclarationStatement();
        this.assert(TOKEN_TYPE.SEMICOLON);
        this.next();

        const clause = this.parseExpression();
        this.assert(TOKEN_TYPE.SEMICOLON);
        this.next();

        const step = this.parseExpression();
        if (this.is(TOKEN_TYPE.SEMICOLON)) {
            this.assert(TOKEN_TYPE.SEMICOLON);
            this.next();
        }

        this.assert(TOKEN_TYPE.CLOSE_PAREN);
        this.next();

        this.assert(TOKEN_TYPE.OPEN_CURLY);
        this.next();

        const bodyStatements = [];
        while (true) {
            if (this.is(TOKEN_TYPE.CLOSE_CURLY)) {
                break;
            }
            bodyStatements.push(this.parseStatement());
        }
        this.assert(TOKEN_TYPE.CLOSE_CURLY);
        this.next();

        return new AST.ForStatement(init, clause, step, bodyStatements);
    }

    next() {
        this.position++;
        this.current = this.tokens[this.position];
    }

    is(expects) {
        if (!Array.isArray(expects)) {
            expects = [expects];
        }
        return expects.indexOf(this.current.type) !== -1;
    }

    assert(expects) {
        if (!Array.isArray(expects)) {
            expects = [expects];
        }
        if (false === this.is(expects)) {
            throw new Error(`Unexpected token ${this.current.type} expects one of ${expects.join(', ')}`);
        }
    }
}


module.exports = {
    parse: function (tokens) {
        const parser = new Parser(tokens);
        return parser.parse()
    }
};