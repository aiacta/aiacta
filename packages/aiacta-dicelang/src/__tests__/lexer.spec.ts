import { lex, SyntaxKind } from '../lexer';

describe('Dicelang - Lexer', () => {
  it('lexes numerical literals', () => {
    expect(lex('1 12 123')).toMatchObject([
      { kind: SyntaxKind.NumericLiteral, pos: 0, value: '1' },
      { kind: SyntaxKind.NumericLiteral, pos: 2, value: '12' },
      { kind: SyntaxKind.NumericLiteral, pos: 5, value: '123' },
    ]);
  });

  it('lexes string literals', () => {
    expect(lex('"str" \'str2\'')).toMatchObject([
      { kind: SyntaxKind.StringLiteral, pos: 0, value: 'str' },
      { kind: SyntaxKind.StringLiteral, pos: 6, value: 'str2' },
    ]);
  });

  it('lexes identifiers', () => {
    expect(lex('id1 id2')).toMatchObject([
      { kind: SyntaxKind.Identifier, pos: 0, value: 'id1' },
      { kind: SyntaxKind.Identifier, pos: 4, value: 'id2' },
    ]);
  });

  it('lexes binary operators', () => {
    expect(lex('+ - * / ??')).toMatchObject([
      { kind: SyntaxKind.BinaryOperator, pos: 0, value: '+' },
      { kind: SyntaxKind.BinaryOperator, pos: 2, value: '-' },
      { kind: SyntaxKind.BinaryOperator, pos: 4, value: '*' },
      { kind: SyntaxKind.BinaryOperator, pos: 6, value: '/' },
      { kind: SyntaxKind.BinaryOperator, pos: 8, value: '??' },
    ]);
  });

  it('lexes ternary operators', () => {
    expect(lex('?')).toMatchObject([
      { kind: SyntaxKind.TernaryOperator, pos: 0, value: '?' },
    ]);
  });

  it('lexes property access', () => {
    expect(lex('some.Prop')).toMatchObject([
      { kind: SyntaxKind.Identifier, pos: 0, value: 'some' },
      { kind: SyntaxKind.PropertyAccess, pos: 4, value: '.' },
      { kind: SyntaxKind.StringLiteral, pos: 5, value: 'Prop' },
    ]);
  });

  it('lexes comma', () => {
    expect(lex(',')).toMatchObject([
      { kind: SyntaxKind.Comma, pos: 0, value: ',' },
    ]);
  });

  it('lexes colon', () => {
    expect(lex(':')).toMatchObject([
      { kind: SyntaxKind.Colon, pos: 0, value: ':' },
    ]);
  });

  it('lexes left and right parentheses', () => {
    expect(lex('()')).toMatchObject([
      { kind: SyntaxKind.LeftParanthesis, pos: 0 },
      { kind: SyntaxKind.RightParenthesis, pos: 1 },
    ]);
  });
});
