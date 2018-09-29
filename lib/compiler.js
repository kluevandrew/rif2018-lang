const AST = require('./ast');
const {Opcode, OPCODE_TYPE} = require('./opcode');


class Compiler {

    constructor(ast) {
        this.ast = ast;
    }

    compile() {
        this.opcodes = [];
        this.locals = [];
        this.compileProgram(this.ast);

        return this.opcodes;
    }

    compileProgram(program) {
        for (let st of program.statements) {
            this.compileStatement(st);
        }
    }

    compileStatement(statement) {
        if (statement instanceof AST.VarDeclarationStatement) {
            this.compileVarDeclarationStatement(statement);
        } else if (statement instanceof AST.ExpressionStatement) {
            this.compileExpressionStatement(statement);
        } else if (statement instanceof AST.IfStatement) {
            this.compileIfStatement(statement);
        } else if (statement instanceof AST.FunctionDeclarationStatement) {
            this.compileFunctionDeclarationStatement(statement);
        } else if (statement instanceof AST.ReturnStatement) {
            this.compileReturnStatement(statement);
        } else if (statement instanceof AST.ForStatement) {
            this.compileForStatement(statement);
        } else {
            this.unexpected(node);
        }
    }

    compileVarDeclarationStatement(statement) {
        let initial = this.compileExpression(statement.initial);

        this.defineLocal(statement.name.name);

        this.opcodes.push(new Opcode(OPCODE_TYPE.STORE, statement.name.name));
    }

    compileExpression(expr) {
        switch (true) {
            case expr instanceof AST.LiteralExpression:
                this.compileLiteralExpression(expr);
                break;
            case expr instanceof AST.IdentifierExpression:
                this.compileIdentifierExpression(expr);
                break;
            case expr instanceof AST.BinaryExpression:
                this.compileBinaryExpression(expr);
                break;
            case expr instanceof AST.CallExpression:
                this.compileCallExpression(expr);
                break;
            case expr instanceof AST.ParenthesesExpression:
                this.compileParenthesesExpression(expr);
                break;
            case expr instanceof AST.AssignExpression:
                this.compileAssignExpression(expr);
                break;
            default:
                this.unexpected(expr);
        }
    }

    compileLiteralExpression(expr) {
        this.opcodes.push(new Opcode(OPCODE_TYPE.LOAD_CONST, expr.value));
    }

    compileIdentifierExpression(expr) {
        this.opcodes.push(new Opcode(OPCODE_TYPE.LOAD_FAST, expr.name));
    }

    compileBinaryExpression(expr) {
        this.compileExpression(expr.right);
        this.compileExpression(expr.left);

        switch (expr.op) {
            case "+":
                this.opcodes.push(new Opcode(OPCODE_TYPE.BINARY_ADD, 0));
                break;
            case "-":
                this.opcodes.push(new Opcode(OPCODE_TYPE.BINARY_REM, 0));
                break;
            case "*":
                this.opcodes.push(new Opcode(OPCODE_TYPE.BINARY_MUL, 0));
                break;
            case "/":
                this.opcodes.push(new Opcode(OPCODE_TYPE.BINARY_DIV, 0));
                break;
            case ">":
                this.opcodes.push(new Opcode(OPCODE_TYPE.BINARY_GT, 0));
                break;
            case ">=":
                this.opcodes.push(new Opcode(OPCODE_TYPE.BINARY_GTE, 0));
                break;
            case "<":
                this.opcodes.push(new Opcode(OPCODE_TYPE.BINARY_LT, 0));
                break;
            case "<=":
                this.opcodes.push(new Opcode(OPCODE_TYPE.BINARY_LTE, 0));
                break;
            case "==":
                this.opcodes.push(new Opcode(OPCODE_TYPE.BINARY_EQ, 0));
                break;
            default:
                throw new Error(`Unexpected operation ${expr.op}`);
        }
    }

    compileCallExpression(expr) {
        let args = expr.args.reverse();
        for (let arg of args) {
            this.compileExpression(arg);
        }

        this.opcodes.push(new Opcode(OPCODE_TYPE.LOAD_FAST, expr.name.name));
        if (this.isLocalDefined(expr.name.name)) {
            this.opcodes.push(new Opcode(OPCODE_TYPE.CALL_USER, expr.args.length));
        } else {
            this.opcodes.push(new Opcode(OPCODE_TYPE.CALL, expr.args.length));
        }
    }

    compileParenthesesExpression(expr) {
        this.compileExpression(expr.expr);
    }

    compileExpressionStatement(statement) {
        this.compileExpression(statement.expr);
        this.opcodes.push(new Opcode(OPCODE_TYPE.POP_TOP, 0));
    }

    compileIfStatement(statement) {
        this.compileExpression(statement.clause);

        let jumpIfFalse = new Opcode(OPCODE_TYPE.JUMP_IF_FALSE, 0);
        this.opcodes.push(jumpIfFalse);

        let positionBeforeIf = this.opcodes.length - 1;
        for (let trueStatement of statement.trueStatements) {
            this.compileStatement(trueStatement);
        }

        let jumpOverElse = new Opcode(OPCODE_TYPE.JUMP, 0);
        if (statement.falseStatements.length > 0) {
            this.opcodes.push(jumpOverElse);
        }

        jumpIfFalse.value = this.opcodes.length - positionBeforeIf;
        let positionBeforeElse = this.opcodes.length - 1;

        if (statement.falseStatements.length > 0) {
            for (let elseStatement of statement.falseStatements) {
                this.compileStatement(elseStatement);
            }
        }

        jumpOverElse.value = this.opcodes.length - positionBeforeElse;
    }

    compileFunctionDeclarationStatement(statement) {
        let jumpToDeclare = new Opcode(OPCODE_TYPE.JUMP, 0);
        this.opcodes.push(jumpToDeclare);

        let positionBeforeFunction = this.opcodes.length - 1;

        for (let bodyStatement of statement.bodyStatements) {
           this.compileStatement(bodyStatement);
        }
        if (this.opcodes[this.opcodes.length - 1].type !== OPCODE_TYPE.RETURN) {
          this.opcodes.push(new Opcode(OPCODE_TYPE.LOAD_CONST, 0));
          this.opcodes.push(new Opcode(OPCODE_TYPE.RETURN, 0));
        }
        jumpToDeclare.value = this.opcodes.length - positionBeforeFunction;

        let argsNames = statement.argsNames.reverse();
        for (let i =0; i < argsNames.length; i++) {
            this.opcodes.push(new Opcode(OPCODE_TYPE.LOAD_CONST, argsNames[i].name))
        }
        this.opcodes.push(new Opcode(OPCODE_TYPE.LOAD_CONST, positionBeforeFunction + 1));

        this.defineLocal(statement.name.name);

        this.opcodes.push(new Opcode(OPCODE_TYPE.LOAD_CONST, statement.name.name));
        this.opcodes.push(new Opcode(OPCODE_TYPE.DECLARE_FUNC, argsNames.length));
    }

    compileReturnStatement(statement) {
        this.compileExpression(statement.expr);
        this.opcodes.push(new Opcode(OPCODE_TYPE.RETURN, 0));
    }

    compileForStatement(statement) {
        this.compileVarDeclarationStatement(statement.init);
        let position = this.opcodes.length - 1;

        this.compileExpression(statement.clause);

        let positionBeforeBody = this.opcodes.length - 1;
        let jumpOverBody = new Opcode(OPCODE_TYPE.JUMP_IF_FALSE, 0);
        this.opcodes.push(jumpOverBody);

        for (let bodyStatement of statement.bodyStatements) {
            this.compileStatement(bodyStatement);
        }
        this.compileExpression(statement.step);
        this.opcodes.push(new Opcode(OPCODE_TYPE.JUMP, position - this.opcodes.length + 1));

        jumpOverBody.value = this.opcodes.length - positionBeforeBody - 1;
    }

    compileAssignExpression(expression) {
        if (false === this.isLocalDefined(expression.name.name)) {
            throw new Error(`Try to set undefined variable ${expression.name.name}`);
        }

        this.compileExpression(expression.value);
        this.opcodes.push(new Opcode(OPCODE_TYPE.STORE, expression.name.name));
    }

    unexpected(node) {
        throw new Error(`Unexpected node ${node.constructor.name}`);
    }

    defineLocal(name) {
        if (this.locals.indexOf(name) === -1) {
            this.locals.push(name);
        }
    }

    isLocalDefined(name) {
        return this.locals.indexOf(name) !== -1
    }

}


module.exports = {
    OPCODE_TYPE,
    compile: function (ast) {
        const compiler = new Compiler(ast);
        return compiler.compile();
    }
};