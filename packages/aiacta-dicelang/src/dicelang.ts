import { Context, execute, Methods, Resolution } from './executor';
import { lex, Token } from './lexer';
import { parse, Statement } from './parser';

export { Context, Methods, Resolution } from './executor';

export class Program {
  private tokens: Token[];
  private statements: Statement[];
  public readonly errors: any[] = [];

  constructor(public readonly input: string) {
    this.tokens = [];
    this.statements = [];
    try {
      this.tokens = lex(input);
      this.statements = parse(this.tokens);
    } catch (err) {
      this.errors.push(err);
    }
  }

  public async run(methods: Partial<Methods> = {}, context: Context = {}) {
    if (this.errors.length === 0) {
      return execute(
        this.statements,
        {
          async roll(faces) {
            return Math.round(Math.random() * (faces - 1)) + 1;
          },
          chatMessages: {},
          ...methods,
        },
        context,
      );
    } else {
      throw new Error();
    }
  }

  public runSync(
    methods: Partial<Exclude<Methods, 'roll'>> = {},
    context: Context = {},
  ) {
    if (this.errors.length === 0) {
      let resolution: Resolution | undefined;
      execute(
        this.statements,
        {
          async roll(_faces) {
            return -1;
          },
          chatMessages: {},
          ...methods,
        },
        context,
      ).then((r) => (resolution = r));
      if (!resolution) {
        throw new Error();
      }
      return resolution;
    } else {
      throw new Error();
    }
  }
}

export default Program;
