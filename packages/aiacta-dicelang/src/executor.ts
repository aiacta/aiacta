import defaultChatMessages from './defaultChatMessages';
import {
  BinaryExpression,
  CallExpression,
  Expression,
  PropertyAccessExpression,
  Statement,
  TernaryExpression,
} from './parser';

export interface Methods {
  roll(faces: number): Promise<number>;
  chatMessages: {
    min?: ChatMessageGenerator<ValueResolution>;
    max?: ChatMessageGenerator<ValueResolution>;
    ceil?: ChatMessageGenerator<ValueResolution>;
    floor?: ChatMessageGenerator<ValueResolution>;
    abs?: ChatMessageGenerator<ValueResolution>;
    identifier?: ChatMessageGenerator<ObjectResolution>;
    literal?: ChatMessageGenerator<Resolution>;
    propertyAccess?: ChatMessageGenerator;
    binaryOp?: (op: string) => ChatMessageGenerator<ValueResolution>;
    dice?: ChatMessageGenerator<RollResolution>;
  };
}

export interface ChatMessageGenerator<T extends Resolution = Resolution> {
  (this: T, isLeaf: boolean): string;
}

export interface Context {
  [key: string]: boolean | string | number | (() => Resolution) | Context;
}

/** @internal  */ export function execute(
  program: Statement[],
  methods: Methods,
  context: Context,
): PromiseLike<Resolution> {
  const chatMessages = {
    ...defaultChatMessages,
    ...methods.chatMessages,
  };
  const heap = new Map<
    string,
    | ((...args: Resolution[]) => Resolution | Promise<Resolution>)
    | Record<any, any>
  >([
    ...Object.entries(context).map(
      ([key, value]) => [key, value] as [string, Record<any, any>],
    ),
    [
      'min',
      (...args) => {
        return {
          value: Math.min(
            ...args.map((a) => unbox(a, Number.MAX_SAFE_INTEGER)),
          ),
          of: [...args],
          toChatMessage: chatMessages.min,
        } as ValueResolution;
      },
    ],
    [
      'max',
      (...args) => {
        return {
          value: Math.max(
            ...args.map((a) => unbox(a, Number.MIN_SAFE_INTEGER)),
          ),
          of: [...args],
          toChatMessage: chatMessages.max,
        } as ValueResolution;
      },
    ],
    [
      'ceil',
      (arg) => {
        if (!isValueResultion(arg)) {
          throw new Error(`Cant ceil a non-value.`);
        }
        return {
          value: Math.ceil(arg.value),
          of: [arg],
          toChatMessage: chatMessages.ceil,
        } as ValueResolution;
      },
    ],
    [
      'floor',
      (arg) => {
        if (!isValueResultion(arg)) {
          throw new Error(`Cant floor a non-value.`);
        }
        return {
          value: Math.floor(arg.value),
          of: [arg],
          toChatMessage: chatMessages.floor,
        } as ValueResolution;
      },
    ],
    [
      'abs',
      (arg) => {
        if (!isValueResultion(arg)) {
          throw new Error(`Cant abs a non-value.`);
        }
        return {
          value: Math.abs(arg.value),
          of: [arg],
          toChatMessage: chatMessages.abs,
        } as ValueResolution;
      },
    ],
    [
      'kh',
      (arr, arg) => {
        const num = unbox(arg);
        if (isNaN(num)) {
          throw new Error('Expect argument of kh to be a value.');
        }
        if (!isRollResolution(arr)) {
          throw new Error(`Cant keep highest of non-roll.`);
        }
        const sorted = [...arr.dice].sort(dieSort).slice(0, num);
        return {
          ...arr,
          get value() {
            return this.dice
              .map((d) => (d.dropped ? 0 : d.value))
              .reduce((acc, cur) => acc + cur, 0);
          },
          dice: arr.dice.map((d) =>
            sorted.indexOf(d) >= 0 ? d : { ...d, dropped: true },
          ),
        } as RollResolution;
      },
    ],
    [
      'dh',
      (arr, arg) => {
        const num = unbox(arg);
        if (isNaN(num)) {
          throw new Error('Expect argument of dh to be a value.');
        }
        if (!isRollResolution(arr)) {
          throw new Error(`Cant drop highest of non-roll.`);
        }
        const sorted = [...arr.dice].sort(dieSort).slice(0, num);
        return {
          ...arr,
          get value() {
            return this.dice
              .map((d) => (d.dropped ? 0 : d.value))
              .reduce((acc, cur) => acc + cur, 0);
          },
          dice: arr.dice.map((d) =>
            sorted.indexOf(d) < 0 ? d : { ...d, dropped: true },
          ),
        } as RollResolution;
      },
    ],
    [
      'kl',
      (arr, arg) => {
        const num = unbox(arg);
        if (isNaN(num)) {
          throw new Error('Expect argument of kl to be a value.');
        }
        if (!isRollResolution(arr)) {
          throw new Error(`Cant keep lowest of non-roll.`);
        }
        const sorted = [...arr.dice].sort(dieSort).reverse().slice(0, num);
        return {
          ...arr,
          get value() {
            return this.dice
              .map((d) => (d.dropped ? 0 : d.value))
              .reduce((acc, cur) => acc + cur, 0);
          },
          dice: arr.dice.map((d) =>
            sorted.indexOf(d) >= 0 ? d : { ...d, dropped: true },
          ),
        } as RollResolution;
      },
    ],
    [
      'dl',
      (arr, arg) => {
        const num = unbox(arg);
        if (isNaN(num)) {
          throw new Error('Expect argument of dl to be a value.');
        }
        if (!isRollResolution(arr)) {
          throw new Error(`Cant drop lowest of non-roll.`);
        }
        const sorted = [...arr.dice].sort(dieSort).reverse().slice(0, num);
        return {
          ...arr,
          get value() {
            return this.dice
              .map((d) => (d.dropped ? 0 : d.value))
              .reduce((acc, cur) => acc + cur, 0);
          },
          dice: arr.dice.map((d) =>
            sorted.indexOf(d) < 0 ? d : { ...d, dropped: true },
          ),
        } as RollResolution;
      },
    ],
    [
      'rb',
      async (arr, arg) => {
        const num = unbox(arg);
        if (isNaN(num)) {
          throw new Error('Expect argument of rb to be a value.');
        }
        if (!isRollResolution(arr)) {
          throw new Error(`Cant reroll below of non-roll.`);
        }
        return {
          ...arr,
          get value() {
            return this.dice
              .map((d) => (d.dropped ? 0 : d.value))
              .reduce((acc, cur) => acc + cur, 0);
          },
          dice: await Promise.all(
            arr.dice.map(async (d) => (d.value < num ? d.reroll() : d)),
          ),
        } as RollResolution;
      },
    ],
    [
      'ra',
      async (arr, arg) => {
        const num = unbox(arg);
        if (isNaN(num)) {
          throw new Error('Expect argument of ra to be a value.');
        }
        if (!isRollResolution(arr)) {
          throw new Error(`Cant reroll above of non-roll.`);
        }
        return {
          ...arr,
          get value() {
            return this.dice
              .map((d) => (d.dropped ? 0 : d.value))
              .reduce((acc, cur) => acc + cur, 0);
          },
          dice: await Promise.all(
            arr.dice.map(async (d) => (d.value > num ? d.reroll() : d)),
          ),
        } as RollResolution;
      },
    ],
    [
      'cr',
      (arr, arg) => {
        const num = unbox(arg);
        if (isNaN(num)) {
          throw new Error('Expect argument of cr to be a value.');
        }
        if (!isRollResolution(arr)) {
          throw new Error(`Cant crit above of non-roll.`);
        }
        return {
          ...arr,
          get value() {
            return this.dice
              .map((d) => (d.dropped ? 0 : d.value))
              .reduce((acc, cur) => acc + cur, 0);
          },
          dice: arr.dice.map((d) =>
            d.value >= num ? { ...d, critical: true } : d,
          ),
        } as RollResolution;
      },
    ],
  ]);
  const returns = [];

  for (const statement of program) {
    switch (statement.type) {
      case 'return':
        returns.push(executeExpression(statement.expression));
        continue;
    }
  }

  return returns[0];

  function unbox(thing: Resolution, invalid = NaN): number {
    if (isRollResolution(thing)) {
      return thing.dice.reduce((acc, d) => acc + (d.dropped ? 0 : d.value), 0);
    }
    if (isValueResultion(thing)) {
      return thing.value;
    }
    return invalid;
  }

  function dieSort(aa: DieResolution, bb: DieResolution) {
    const a = aa.dropped ? 0 : aa.value;
    const b = bb.dropped ? 0 : bb.value;
    return a < b ? 1 : a > b ? -1 : 0;
  }

  function executeExpression(expression: Expression): PromiseLike<Resolution> {
    switch (expression.type) {
      case 'propAccess':
        return executePropertyAccess(expression);
      case 'op':
        return executeBinaryExpression(expression);
      case 'op3':
        return executeTernaryExpression(expression);
      case 'call':
        return executeCallExpression(expression);
      case 'identifier':
        return {
          then(cb) {
            if (cb) {
              cb({
                name: expression.name,
                value: heap.get(expression.name),
                toChatMessage: chatMessages.identifier,
              });
            }
            return this;
          },
        } as PromiseLike<ObjectResolution>;
      case 'literal':
        return {
          then(cb) {
            if (cb) {
              cb({
                value: expression.value,
                toChatMessage: chatMessages.literal,
              });
            }
            return this;
          },
        } as PromiseLike<Resolution>;
    }
  }

  function executeMaybePromise(
    exp: PromiseLike<Resolution>,
    fn: (res: Resolution) => Resolution | PromiseLike<Resolution>,
  ): PromiseLike<Resolution> {
    let resolution: Resolution | undefined;
    exp.then((r) => {
      resolution = r;
    });
    if (resolution) {
      const res = fn(resolution);
      return {
        then(cb?: (value: Resolution) => Resolution) {
          if (cb) {
            if ('then' in res) {
              return executeMaybePromise(res, (r) => cb(r));
            } else {
              cb(res);
            }
          }
          return this;
        },
      } as PromiseLike<Resolution>;
    } else {
      return exp.then((res) => fn(res));
    }
  }

  function executeMaybeAllPromises(
    exps: Array<PromiseLike<Resolution>>,
    fn: (res: Resolution[]) => Resolution | PromiseLike<Resolution>,
  ): PromiseLike<Resolution> {
    const resolved = exps.map((e) => {
      let res: Resolution | undefined;
      e.then((r) => {
        res = r;
      });
      return res!;
    });
    if (resolved.every(Boolean)) {
      const res = fn(resolved);
      return {
        then(cb?: (value: Resolution) => Resolution) {
          if (cb) {
            if ('then' in res) {
              return executeMaybePromise(res, (r) => cb(r));
            } else {
              cb(res);
            }
          }
          return this;
        },
      } as PromiseLike<Resolution>;
    } else {
      return Promise.all(exps).then((res) => fn(res));
    }
  }

  function executeCallExpression(
    expression: CallExpression,
  ): PromiseLike<Resolution> {
    return executeMaybeAllPromises(
      [
        executeExpression(expression.func),
        ...(expression.args
          ? expression.args.map((arg) => executeExpression(arg))
          : []),
      ],
      ([func, ...args]) => {
        return (func.value as any)(...args);
      },
    );
  }

  function executePropertyAccess(
    expression: PropertyAccessExpression,
  ): PromiseLike<Resolution> {
    return executeMaybePromise(executeExpression(expression.obj), (obj) => {
      const key = expression.key.value;
      return {
        value:
          typeof obj.value === 'object' && key.toString() in obj.value
            ? (obj.value as any)[key.toString()]
            : undefined,
        of: [obj, key],
        toChatMessage: chatMessages.propertyAccess,
      } as Resolution;
    });
  }

  function executeBinaryExpression(
    expression: BinaryExpression,
  ): PromiseLike<Resolution> {
    return executeMaybeAllPromises(
      [executeExpression(expression.left), executeExpression(expression.right)],
      ([left, right]) => {
        switch (expression.op) {
          case '+':
            return {
              value: unbox(left, 0) + unbox(right, 0),
              of: [left, right],
              toChatMessage: chatMessages.binaryOp(expression.op),
            } as ValueResolution;
          case '-':
            return {
              value: unbox(left, 0) - unbox(right, 0),
              of: [left, right],
              toChatMessage: chatMessages.binaryOp(expression.op),
            } as ValueResolution;
          case '*':
            return {
              value: unbox(left, 1) * unbox(right, 1),
              of: [left, right],
              toChatMessage: chatMessages.binaryOp(expression.op),
            } as ValueResolution;
          case '/':
            return {
              value: unbox(left, 0) / unbox(right, 1),
              of: [left, right],
              toChatMessage: chatMessages.binaryOp(expression.op),
            } as ValueResolution;
          case 'kh':
          case 'dh':
          case 'kl':
          case 'dl':
          case 'rb':
          case 'ra':
          case 'cr': {
            const func = heap.get(expression.op);
            if (typeof func !== 'function') {
              throw new Error('Expected function for ' + expression.op);
            }
            return func(left, right);
          }
          case '??': {
            const unboxedLeft = unbox(left);
            const unboxedRight = unbox(right);
            return {
              value: unboxedLeft || unboxedRight,
              of: [left, right],
              toChatMessage: chatMessages.binaryOp(expression.op),
            } as ValueResolution;
          }
          case 'd': {
            const unboxedLeft = unbox(left);
            const unboxedRight = unbox(right);
            if (isNaN(unboxedLeft) || isNaN(unboxedRight)) {
              throw new Error(`Cant roll dice: ${unboxedLeft}d${unboxedRight}`);
            }
            return Promise.all(
              Array(unboxedLeft)
                .fill(null)
                .map(() => methods.roll(unboxedRight)),
            ).then(
              (rolls) =>
                ({
                  get value() {
                    return this.dice
                      .map((d) => (d.dropped ? 0 : d.value))
                      .reduce((acc, cur) => acc + cur, 0);
                  },
                  of: [left, right],
                  dice: rolls.map(
                    (value) =>
                      ({
                        value,
                        faces: unboxedRight,
                        async reroll() {
                          const v = methods.roll(this.faces);
                          if (!this.previousValues) {
                            this.previousValues = [this.value];
                          } else {
                            this.previousValues.push(this.value);
                          }
                          this.value = await v;
                          return this;
                        },
                        ...(unboxedRight === 20 &&
                          value === unboxedRight && { critical: true }),
                      } as DieResolution),
                  ),
                  toChatMessage: chatMessages.dice,
                } as RollResolution),
            );
          }
          default:
            throw new Error(`Operation ${expression.op} not implemented`);
        }
      },
    );
  }

  function executeTernaryExpression(
    expression: TernaryExpression,
  ): PromiseLike<Resolution> {
    return executeMaybePromise(executeExpression(expression.left), (left) => {
      if (left.value) {
        return executeExpression(expression.middle);
      }
      return executeExpression(expression.right);
    });
  }
}

export interface Resolution<
  T = number | string | boolean | Record<any, any> | ((...args: any[]) => any),
> {
  value: T;
  of?: Resolution[];
  toChatMessage(isLeaf?: boolean): string;
}

interface RollResolution extends Resolution {
  dice: DieResolution[];
}

interface ObjectResolution extends Resolution<any> {
  name: string;
}

interface ValueResolution extends Resolution<number> {
  of: Resolution[];
}

interface DieResolution extends Resolution<number> {
  faces: number;
  dropped?: boolean;
  critical?: boolean;
  previousValues?: number[];
  reroll(): Promise<DieResolution>;
}

function isRollResolution(r: Resolution): r is RollResolution {
  return 'dice' in r;
}
function isValueResultion(r: Resolution): r is ValueResolution {
  return typeof r.value === 'number';
}
