import { SyntaxKind, Token } from './lexer';

const operatorPrecedence: { [key: string]: number } = [
  ['d'],
  ['kh', 'dh', 'kl', 'dl', 'rb', 'ra', 'cr'],
  ['*', '/'],
  ['+', '-'],
  ['??'],
].reduce(
  (agg, ops, lvl, lvls) =>
    ops.reduce((obj, op) => ({ ...obj, [op]: lvls.length - lvl }), agg),
  {},
);

/** @internal  */ export function parse(tokens: Token[]) {
  let p = -1;
  let tok: Token;
  const statements: Statement[] = [];
  while (++p < tokens.length) {
    tok = tokens[p];
    statements.push(parseStatement());
  }

  return statements;

  function parseStatement(): Statement {
    return { type: 'return', expression: parseExpression() };
  }

  function parseExpression(): Expression {
    return maybeTernary(
      maybeBinary(maybeCall(() => maybePropertyAccess(parseAtom()))),
    );
  }

  function maybePropertyAccess(left: Expression): Expression {
    if (is(SyntaxKind.PropertyAccess)) {
      consume();
      const expression = {
        type: 'propAccess',
        obj: left,
        key: parseLiteral(),
      } as PropertyAccessExpression;
      return maybePropertyAccess(expression);
    }
    return left;
  }

  function maybeCall(fn: () => Expression): Expression {
    const expression = fn();
    if (is(SyntaxKind.LeftParanthesis)) {
      consume();
      if (is(SyntaxKind.RightParenthesis)) {
        consume();
        return { type: 'call', func: expression } as CallExpression;
      }
      const args = maybeList(() => parseExpression());
      consume(SyntaxKind.RightParenthesis);
      return { type: 'call', func: expression, args } as CallExpression;
    }
    return expression;
  }

  function maybeList(fn: () => Expression): Expression[] {
    const expression = fn();
    if (is(SyntaxKind.Comma)) {
      consume();
      const next = maybeList(fn);
      return [expression, ...next];
    }
    return [expression];
  }

  function maybeBinary(left: Expression, precedence = 0): Expression {
    if (is(SyntaxKind.BinaryOperator)) {
      const nextPrecedence = operatorPrecedence[tok.value!];
      if (nextPrecedence > precedence) {
        const op = consume();
        const right = maybeBinary(
          maybeCall(() => maybePropertyAccess(parseAtom())),
          nextPrecedence,
        );
        const binary = {
          type: 'op',
          left,
          op: op.value,
          right,
        } as BinaryExpression;
        return maybeBinary(binary, precedence);
      }
    }
    return left;
  }

  function maybeTernary(left: Expression): Expression {
    if (is(SyntaxKind.TernaryOperator)) {
      const op = consume();
      const middle = maybeTernary(
        maybeBinary(maybeCall(() => maybePropertyAccess(parseAtom()))),
      );
      consume(SyntaxKind.Colon);
      const right = maybeTernary(
        maybeBinary(maybeCall(() => maybePropertyAccess(parseAtom()))),
      );
      const ternary = {
        type: 'op3',
        op: op.value,
        left,
        middle,
        right,
      } as TernaryExpression;
      return ternary;
    }
    return left;
  }

  function parseAtom(): Expression {
    if (is(SyntaxKind.LeftParanthesis)) {
      consume();
      const expression = parseExpression();
      consume(SyntaxKind.RightParenthesis);
      return expression;
    }
    if (is(SyntaxKind.Identifier)) {
      return {
        type: 'identifier',
        name: consume(SyntaxKind.Identifier).value!,
      };
    }
    return parseLiteral();
  }

  function parseLiteral(): LiteralExpression {
    if (is(SyntaxKind.StringLiteral)) {
      return {
        type: 'literal',
        value: consume(SyntaxKind.StringLiteral).value!,
      };
    }
    return {
      type: 'literal',
      value: +consume(SyntaxKind.NumericLiteral).value!,
    };
  }

  /////

  function is(kind?: SyntaxKind) {
    return tok && (typeof kind === 'undefined' || tok.kind === kind);
  }

  function consume(kind?: SyntaxKind) {
    if (!is(kind)) {
      throw new Error(
        `Expected token${
          typeof kind !== 'undefined' ? ' ' + SyntaxKind[kind] : ''
        }, got ${tok && SyntaxKind[tok.kind] + (tok && ` at pos ${tok.pos}`)}`,
      );
    }
    tok = tokens[++p];
    return tokens[p - 1];
  }
}

/** @internal  */ export type Statement = ReturnStatement;

/** @internal  */ export interface ReturnStatement {
  type: 'return';
  expression: Expression;
}

/** @internal  */ export type Expression =
  | CallExpression
  | BinaryExpression
  | TernaryExpression
  | PropertyAccessExpression
  | IdentifierExpression
  | LiteralExpression;

/** @internal  */ export interface CallExpression {
  type: 'call';
  func: Expression;
  args?: [Expression];
}

/** @internal  */ export interface BinaryExpression {
  type: 'op';
  op: string;
  left: Expression;
  right: Expression;
}

/** @internal  */ export interface TernaryExpression {
  type: 'op3';
  op: string;
  left: Expression;
  middle: Expression;
  right: Expression;
}

/** @internal  */ export interface PropertyAccessExpression {
  type: 'propAccess';
  obj: Expression;
  key: LiteralExpression;
}

/** @internal  */ export interface IdentifierExpression {
  type: 'identifier';
  name: string;
}

/** @internal  */ export interface LiteralExpression {
  type: 'literal';
  value: number | boolean | string;
}
