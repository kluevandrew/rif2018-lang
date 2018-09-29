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

class ExpressionStatement extends Statement {
    constructor(expr) {
        super();
        this.expr = expr;
    }
}

class IfStatement extends Statement {
    constructor(cluase, trueStatements, falseStatements) {
        super();
        this.cluase = cluase;
        this.trueStatements = trueStatements;
        this.falseStatements = falseStatements;
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
};