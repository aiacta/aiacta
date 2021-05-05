/** @internal  */ export enum SyntaxKind {
  NumericLiteral,
  StringLiteral,
  Identifier,
  BinaryOperator,
  TernaryOperator,
  PropertyAccess,
  Comma,
  Colon,
  LeftParanthesis,
  RightParenthesis,
  EOF,
}

enum RollModifier {
  kh,
  dh,
  kl,
  dl,
  rb,
  ra,
  cr,
}

/** @internal  */ export interface Token {
  kind: SyntaxKind;
  pos: number;
  value?: string;
}

/** @internal  */ export function lex(input: string) {
  // input = input.replace(/\s+/g, '');
  let p = -1;
  const tokens: Token[] = [];
  while (++p < input.length) {
    const ch = input.charAt(p);

    switch (ch) {
      case ' ':
        continue;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        tokens.push({
          kind: SyntaxKind.NumericLiteral,
          pos: p,
          value: scanNumber(),
        });
        continue;
      case '"':
      case "'":
        tokens.push({
          kind: SyntaxKind.StringLiteral,
          pos: p++,
          value: scanString(),
        });
        continue;
      case '.':
        tokens.push({
          kind: SyntaxKind.PropertyAccess,
          pos: p,
          value: ch,
        });
        continue;
      case ',':
        tokens.push({
          kind: SyntaxKind.Comma,
          pos: p,
          value: ch,
        });
        continue;
      case '+':
      case '-':
      case '*':
      case '/':
        tokens.push({
          kind: SyntaxKind.BinaryOperator,
          pos: p,
          value: ch,
        });
        continue;
      case '(':
        tokens.push({
          kind: SyntaxKind.LeftParanthesis,
          pos: p,
        });
        continue;
      case ')':
        tokens.push({
          kind: SyntaxKind.RightParenthesis,
          pos: p,
        });
        continue;
      case '?':
        if (input.charAt(p + 1) === '?') {
          tokens.push({
            kind: SyntaxKind.BinaryOperator,
            pos: p,
            value: '??',
          });
          ++p;
          continue;
        } else {
          tokens.push({
            kind: SyntaxKind.TernaryOperator,
            pos: p,
            value: ch,
          });
          continue;
        }
      case ':':
        tokens.push({
          kind: SyntaxKind.Colon,
          pos: p,
          value: ch,
        });
        continue;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      case 'd':
        if (input.charAt(p + 1).match(/[0-9]/)) {
          const prev = tokens.slice(-1)[0];
          // implicit [1]dX
          if (
            !prev ||
            (prev.kind !== SyntaxKind.NumericLiteral &&
              prev.kind !== SyntaxKind.RightParenthesis)
          ) {
            tokens.push({
              kind: SyntaxKind.NumericLiteral,
              pos: p,
              value: '1',
            });
          }
          tokens.push({
            kind: SyntaxKind.BinaryOperator,
            pos: p,
            value: 'd',
          });
          continue;
        }
      // eslint-disable-next-line no-fallthrough
      default:
        {
          const pos = p;
          const id = scanIdentifier();
          if (id in RollModifier) {
            tokens.push({
              kind: SyntaxKind.BinaryOperator,
              pos,
              value: id,
            });
            // implicit xdXmod[1]
            if (!input.charAt(p + 1).match(/[0-9(]/)) {
              tokens.push({
                kind: SyntaxKind.NumericLiteral,
                pos,
                value: '1',
              });
            }
          } else {
            const prev = tokens.slice(-1)[0];
            if (prev && prev.kind === SyntaxKind.PropertyAccess) {
              tokens.push({
                kind: SyntaxKind.StringLiteral,
                pos,
                value: id,
              });
            } else {
              tokens.push({
                kind: SyntaxKind.Identifier,
                pos,
                value: id,
              });
            }
            // if (
            //   prev &&
            //   prev.kind !== SyntaxKind.BinaryOperator &&
            //   prev.kind !== SyntaxKind.LeftParanthesis &&
            //   prev.kind !== SyntaxKind.Comma
            // ) {
            //   throw new Error(`Unexpected identifier at pos ${p} ${id}!`);
            // } else {
            //   tokens.push({
            //     kind: SyntaxKind.Identifier,
            //     pos: p,
            //     value: id,
            //   });
            // }
          }
        }
        continue;
    }
  }

  return tokens;

  function scanNumber() {
    let num = input.charAt(p);
    while (p < input.length - 1) {
      const ch = input.charAt(p + 1);
      if (ch.match(/\d/)) {
        num += ch;
        ++p;
      } else {
        break;
      }
    }
    return num;
  }

  function scanString() {
    let num = input.charAt(p);
    while (p < input.length - 1) {
      const ch = input.charAt(p + 1);
      if (ch.match(/[^"']/)) {
        num += ch;
        ++p;
      } else {
        ++p;
        break;
      }
    }
    return num;
  }

  function scanIdentifier() {
    let id = input.charAt(p);
    while (p < input.length - 1) {
      const ch = input.charAt(p + 1);
      if (ch.match(/[a-z0-9]/i)) {
        id += ch;
        ++p;
        if (id in RollModifier && input.charAt(p + 1).match(/[0-9]/)) {
          break;
        }
      } else {
        break;
      }
    }
    return id;
  }
}
