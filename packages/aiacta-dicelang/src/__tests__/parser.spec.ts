import { parse } from '../parser';
import { lex } from '../lexer';

describe('Dicelang - Parser', () => {
  describe('Atoms', () => {
    it('parses single numbers', () => {
      expect(parse(lex('12'))).toMatchObject([
        { expression: { type: 'literal', value: 12 }, type: 'return' },
      ]);
    });

    it('parses single strings', () => {
      expect(parse(lex('"string"'))).toMatchObject([
        { expression: { type: 'literal', value: 'string' }, type: 'return' },
      ]);
    });
  });

  describe('Binary expressions', () => {
    it('parses with numbers', () => {
      expect(parse(lex('12 + 15'))).toMatchObject([
        {
          expression: {
            left: { type: 'literal', value: 12 },
            op: '+',
            right: { type: 'literal', value: 15 },
            type: 'op',
          },
          type: 'return',
        },
      ]);
    });

    it('parses with correct prevalence', () => {
      expect(parse(lex('12 + 15 * 5 - 19 / 3 + (12 - 12)'))).toMatchObject([
        {
          expression: {
            left: {
              left: {
                left: { type: 'literal', value: 12 },
                op: '+',
                right: {
                  left: { type: 'literal', value: 15 },
                  op: '*',
                  right: { type: 'literal', value: 5 },
                  type: 'op',
                },
                type: 'op',
              },
              op: '-',
              right: {
                left: { type: 'literal', value: 19 },
                op: '/',
                right: { type: 'literal', value: 3 },
                type: 'op',
              },
              type: 'op',
            },
            op: '+',
            right: {
              left: { type: 'literal', value: 12 },
              op: '-',
              right: { type: 'literal', value: 12 },
              type: 'op',
            },
            type: 'op',
          },
          type: 'return',
        },
      ]);
    });

    it('parses all calls', () => {
      expect(
        parse(
          lex(
            'min(10,2) + max(2,10) - ceil(2/3) * floor(10/3) / abs(2) + 2d10kh1 + this + this.random',
          ),
        ),
      ).toMatchObject([
        {
          expression: {
            left: {
              left: {
                left: {
                  left: {
                    left: {
                      args: [
                        { type: 'literal', value: 10 },
                        { type: 'literal', value: 2 },
                      ],
                      func: { name: 'min', type: 'identifier' },
                      type: 'call',
                    },
                    op: '+',
                    right: {
                      args: [
                        { type: 'literal', value: 2 },
                        { type: 'literal', value: 10 },
                      ],
                      func: { name: 'max', type: 'identifier' },
                      type: 'call',
                    },
                    type: 'op',
                  },
                  op: '-',
                  right: {
                    left: {
                      left: {
                        args: [
                          {
                            left: {
                              type: 'literal',
                              value: 2,
                            },
                            op: '/',
                            right: {
                              type: 'literal',
                              value: 3,
                            },
                            type: 'op',
                          },
                        ],
                        func: { name: 'ceil', type: 'identifier' },
                        type: 'call',
                      },
                      op: '*',
                      right: {
                        args: [
                          {
                            left: {
                              type: 'literal',
                              value: 10,
                            },
                            op: '/',
                            right: {
                              type: 'literal',
                              value: 3,
                            },
                            type: 'op',
                          },
                        ],
                        func: { name: 'floor', type: 'identifier' },
                        type: 'call',
                      },
                      type: 'op',
                    },
                    op: '/',
                    right: {
                      args: [{ type: 'literal', value: 2 }],
                      func: { name: 'abs', type: 'identifier' },
                      type: 'call',
                    },
                    type: 'op',
                  },
                  type: 'op',
                },
                op: '+',
                right: {
                  left: {
                    left: { type: 'literal', value: 2 },
                    op: 'd',
                    right: { type: 'literal', value: 10 },
                    type: 'op',
                  },
                  op: 'kh',
                  right: { type: 'literal', value: 1 },
                  type: 'op',
                },
                type: 'op',
              },
              op: '+',
              right: { name: 'this', type: 'identifier' },
              type: 'op',
            },
            op: '+',
            right: {
              key: { type: 'literal', value: 'random' },
              obj: { name: 'this', type: 'identifier' },
              type: 'propAccess',
            },
            type: 'op',
          },
          type: 'return',
        },
      ]);
    });
  });
});
