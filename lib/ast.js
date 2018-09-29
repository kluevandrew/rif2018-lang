class Node {
    toString() {
        return this.constructor.name;
    }
}

class Expression extends Node {

}

class Statement extends Node {

}

class Program extends Node {
    constructor(statements) {
        super();
        this.statements = statements;
    }
}

class VarDeclarationStatement extends Statement {
    constructor(name, initial) {
        super();
        this.name = name;
        this.initial = initial;
    }
}

class FunctionDeclarationStatement extends Statement {
    constructor(name, argsNames, bodyStatements) {
        super();
        this.name = name;
        this.argsNames = argsNames;
        this.bodyStatements = bodyStatements;
    }
}

class ReturnStatement extends Statement {
    constructor(expr) {
        super();
        this.expr = expr;
    }
}

class ExpressionStatement extends Statement {
    constructor(expr) {
        super();
        this.expr = expr;
    }
}

class IfStatement extends Statement {
    constructor(clause, trueStatements, falseStatements) {
        super();
        this.clause = clause;
        this.trueStatements = trueStatements;
        this.falseStatements = falseStatements;
    }
}

class ForStatement extends Statement {
    constructor(init, clause, step, bodyStatements) {
        super();
        this.init = init;
        this.clause = clause;
        this.step = step;
        this.bodyStatements = bodyStatements;
    }
}

class CallExpression extends Expression {
    constructor(name, args) {
        super();
        this.name = name;
        this.args = args;
    }
}

class IdentifierExpression extends Expression {
    constructor(name) {
        super();
        this.name = name;
    }
}

class LiteralExpression extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }
}

class BinaryExpression extends Expression {
    constructor(left, op, right) {
        super();
        this.left = left;
        this.op = op;
        this.right = right;
    }
}

class ParenthesesExpression extends Expression {
    constructor(expr) {
        super();
        this.expr = expr;
    }
}


class AssignExpression extends Expression {
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
    }
}

module.exports = {
    Node,
    Expression,
    Statement,
    Program,
    VarDeclarationStatement,
    ExpressionStatement,
    CallExpression,
    IdentifierExpression,
    LiteralExpression,
    BinaryExpression,
    IfStatement,
    ParenthesesExpression,
    FunctionDeclarationStatement,
    ReturnStatement,
    ForStatement,
    AssignExpression,
};