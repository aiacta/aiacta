import Program from '../dicelang';

describe('Dicelang', () => {
  const context = {
    roll: jest.fn(async (faces: number) => faces),
  };
  beforeEach(() => {
    context.roll.mockReset();
    context.roll.mockImplementation(async (faces: number) => faces);
  });

  it('works with synchronous execution', () => {
    const program = new Program('2');
    const resolution = program.runSync(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).not.toHaveBeenCalled();
    expect(resolution.value).toBe(2);
  });

  it('fails with synchronous execution and rolls', () => {
    const program = new Program('2d6');
    expect(() => program.runSync(context)).toThrow();
  });

  it('works with literals', async () => {
    const program = new Program('2');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).not.toHaveBeenCalled();
    expect(resolution.value).toBe(2);
  });

  it('works with basic dice rolls', async () => {
    const program = new Program('1d6');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledWith(6);
    expect(resolution.value).toBe(6);
  });

  it('works with math operations (addition)', async () => {
    const program = new Program('2 + 1d6');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledWith(6);
    expect(resolution.value).toBe(8);
  });

  it('works with math operations (subtraction)', async () => {
    const program = new Program('2 - 1d6');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledWith(6);
    expect(resolution.value).toBe(-4);
  });

  it('works with math operations (multiplication)', async () => {
    const program = new Program('2 * 1d6');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledWith(6);
    expect(resolution.value).toBe(12);
  });

  it('works with math operations (division)', async () => {
    const program = new Program('2 / 1d6');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledWith(6);
    expect(resolution.value).toBe(1 / 3);
  });

  it('works with math operations (two rolls)', async () => {
    const program = new Program('1d8 - 1d6');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledWith(8);
    expect(context.roll).toHaveBeenCalledWith(6);
    expect(resolution.value).toBe(2);
  });

  it('works with parentheses', async () => {
    const program = new Program('(2 + 4) * 8');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe((2 + 4) * 8);
  });

  it('works with multiple rolls', async () => {
    const program = new Program('2 + 1d6 + 1d8');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledWith(6);
    expect(context.roll).toHaveBeenCalledWith(8);
    expect(resolution.value).toBe(16);
  });

  it('works with nested rolls', async () => {
    const program = new Program('1d6d8');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledWith(6);
    expect(context.roll).toHaveBeenCalledWith(8);
    expect(resolution.value).toBe(6 * 8);
  });

  it('works with nested nested rolls', async () => {
    const program = new Program('1d6d8d10');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledWith(6);
    expect(context.roll).toHaveBeenCalledWith(8);
    expect(resolution.value).toBe(6 * 8 * 10);
  });

  it('marks critical rolls', async () => {
    context.roll
      .mockImplementationOnce(async () => 1)
      .mockImplementationOnce(async () => 20);
    const program = new Program('2d20');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution).toMatchObject({
      dice: [{ value: 1 }, { critical: true, value: 20 }],
    });
  });

  it('works with roll modifications (keep-highest) and implicit', async () => {
    context.roll
      .mockImplementationOnce(async () => 2)
      .mockImplementationOnce(async () => 4)
      .mockImplementationOnce(async () => 6);
    const program = new Program('3d6kh');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledTimes(3);
    expect(resolution.value).toBe(6);
    expect(resolution).toMatchObject({
      dice: [
        { dropped: true, value: 2 },
        { dropped: true, value: 4 },
        { value: 6 },
      ],
    });
  });

  it('works with roll modifications (drop-lowest)', async () => {
    context.roll
      .mockImplementationOnce(async () => 2)
      .mockImplementationOnce(async () => 4)
      .mockImplementationOnce(async () => 6);
    const program = new Program('3d6dl2');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledTimes(3);
    expect(resolution.value).toBe(6);
    expect(resolution).toMatchObject({
      dice: [
        { dropped: true, value: 2 },
        { dropped: true, value: 4 },
        { value: 6 },
      ],
    });
  });

  it('works with roll modifications (drop-highest)', async () => {
    context.roll
      .mockImplementationOnce(async () => 2)
      .mockImplementationOnce(async () => 4)
      .mockImplementationOnce(async () => 6);
    const program = new Program('3d6dh2');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledTimes(3);
    expect(resolution.value).toBe(2);
    expect(resolution).toMatchObject({
      dice: [
        { value: 2 },
        { dropped: true, value: 4 },
        { dropped: true, value: 6 },
      ],
    });
  });

  it('works with roll modifications (keep-lowest)', async () => {
    context.roll
      .mockImplementationOnce(async () => 2)
      .mockImplementationOnce(async () => 4)
      .mockImplementationOnce(async () => 6);
    const program = new Program('3d6kl2');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledTimes(3);
    expect(resolution.value).toBe(6);
    expect(resolution).toMatchObject({
      dice: [{ value: 2 }, { value: 4 }, { dropped: true, value: 6 }],
    });
  });

  it('works with roll modifications (keep-highest)', async () => {
    context.roll
      .mockImplementationOnce(async () => 2)
      .mockImplementationOnce(async () => 4)
      .mockImplementationOnce(async () => 6);
    const program = new Program('3d6kh2');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledTimes(3);
    expect(resolution.value).toBe(10);
    expect(resolution).toMatchObject({
      dice: [{ dropped: true, value: 2 }, { value: 4 }, { value: 6 }],
    });
  });

  it('works with roll modifications (reroll-below)', async () => {
    context.roll
      .mockImplementationOnce(async () => 1)
      .mockImplementationOnce(async () => 3)
      .mockImplementationOnce(async () => 4)
      .mockImplementationOnce(async () => 2);
    const program = new Program('3d6rb3');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledTimes(4);
    expect(resolution.value).toBe(9);
    expect(resolution).toMatchObject({
      dice: [{ previousValues: [1], value: 2 }, { value: 3 }, { value: 4 }],
    });
  });

  it('works with roll modifications (reroll-above)', async () => {
    context.roll
      .mockImplementationOnce(async () => 1)
      .mockImplementationOnce(async () => 3)
      .mockImplementationOnce(async () => 4)
      .mockImplementationOnce(async () => 2);
    const program = new Program('3d6ra3');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledTimes(4);
    expect(resolution.value).toBe(6);
    expect(resolution).toMatchObject({
      dice: [{ value: 1 }, { value: 3 }, { value: 2, previousValues: [4] }],
    });
  });

  it('works with roll modifications (crit-range)', async () => {
    context.roll
      .mockImplementationOnce(async () => 10)
      .mockImplementationOnce(async () => 14)
      .mockImplementationOnce(async () => 18)
      .mockImplementationOnce(async () => 19)
      .mockImplementationOnce(async () => 20);
    const program = new Program('5d20cr18');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(context.roll).toHaveBeenCalledTimes(5);
    expect(resolution).toMatchObject({
      dice: [
        { value: 10 },
        { value: 14 },
        { critical: true, value: 18 },
        { critical: true, value: 19 },
        { critical: true, value: 20 },
      ],
    });
  });

  it('works with identifiers', async () => {
    const program = new Program('randomValue');
    const resolution = await program.run(context, { randomValue: 10 });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(10);
  });

  it('works with rolls and identifiers', async () => {
    const program = new Program('(randomValue)d8');
    const resolution = await program.run(context, { randomValue: 10 });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(80);
  });

  it('works with properties', async () => {
    const program = new Program('this.randomValue');
    const resolution = await program.run(context, {
      this: { randomValue: 10 },
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(10);
  });

  it('works with nested properties', async () => {
    const program = new Program('this.random.value');
    const resolution = await program.run(context, {
      this: { random: { value: 10 } },
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(10);
  });

  it('works with rolls and properties', async () => {
    const program = new Program('(this.randomValue)d8');
    const resolution = await program.run(context, {
      this: { randomValue: 10 },
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(80);
  });

  it('works with calls', async () => {
    const program = new Program('this.fn()');
    const fn = jest.fn(() => ({
      value: 10,
      toChatMessage() {
        return '';
      },
    }));
    const resolution = await program.run(context, {
      this: { fn },
    });
    expect(program.errors).toHaveLength(0);
    expect(fn).toHaveBeenCalled();
    expect(resolution.value).toBe(10);
  });

  it('works with properties and math', async () => {
    const program = new Program('10 + this.randomValue');
    const resolution = await program.run(context, {
      this: { randomValue: 10 },
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(20);
  });

  it('works with properties and optional chaining', async () => {
    const program = new Program('10 + this.random.value.xy');
    const resolution = await program.run(context, {
      this: {},
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(10);
  });

  it('works with properties and math', async () => {
    const program = new Program('this.randomValue + 10');
    const resolution = await program.run(context, {
      this: { randomValue: 10 },
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(20);
  });

  it('generates chat messages', async () => {
    const program = new Program(
      'min(10,2) + max(2,10) - ceil(2/3) * floor(10/3) / abs(2) + 2d10kh1 + this + this.random',
    );
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution.toChatMessage(true)).toMatchSnapshot();
  });

  it('works with singular argument', async () => {
    const program = new Program('min(4)');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(4);
  });

  it('works with multiple arguments', async () => {
    const program = new Program('min(4, 7, 1)');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(1);
  });

  it('works with calls and properties', async () => {
    const program = new Program('max(this.randomValue, d8)');
    const resolution = await program.run(context, {
      this: { randomValue: 10 },
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(10);
  });

  it('works with math and calls and properties', async () => {
    const program = new Program(
      '10 + min(this.randomValue0, this.randomValue1)',
    );
    const resolution = await program.run(context, {
      this: { randomValue0: 6 },
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(16);
  });

  it('throws with syntax errors', async () => {
    const program = new Program('0 + ');
    expect(program.errors).toHaveLength(1);
    await expect(program.run(context)).rejects.toThrow();
  });

  it('throws with semantic errors', async () => {
    await Promise.all(
      [
        'ceil(this)',
        'floor(this)',
        'abs(this)',
        'sum(this)',
        '2d6kh(this)',
        '(this)kh',
        '2d6dh(this)',
        '(this)dh',
        '2d6kl(this)',
        '(this)kl',
        '2d6dl(this)',
        '(this)dl',
        '2d6rb(this)',
        // '(this)rb',
        '2d6ra(this)',
        // '(this)ra',
        '2d6cr(this)',
        '(this)cr',
        '(random)d6',
        'random()',
      ].map(async (c) => {
        const program = new Program(c);
        await expect(program.run(context, { random: 'asd' })).rejects.toThrow();
      }),
    );
  });

  it('works with built in func (ceil)', async () => {
    const program = new Program('ceil(2/3)');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(1);
  });

  it('works with built in func (floor)', async () => {
    const program = new Program('floor(2/3)');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(0);
  });

  it('works with built in func (abs)', async () => {
    const program = new Program('abs(0 - 2)');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(2);
  });

  it('works without providing an implementation', async () => {
    const program = new Program('1d6');
    const resolution = await program.run();
    expect(program.errors).toHaveLength(0);
    expect(context.roll).not.toHaveBeenCalled();
    expect(resolution.value).toBeGreaterThan(0);
    expect(resolution.value).toBeLessThanOrEqual(6);
  });

  it('works with null coalescing operator (provided)', async () => {
    const program = new Program('this.gear.armorClass ?? 10');
    const resolution = await program.run(context, {
      this: { gear: { armorClass: 18 } },
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(18);
  });

  it('works with null coalescing operator (not provided)', async () => {
    const program = new Program('this.gear.armorClass ?? 10');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(10);
  });

  it('works with conditional operator (true)', async () => {
    const program = new Program('this.gear.armor ? 10 : 5');
    const resolution = await program.run(context, {
      this: { gear: { armor: {} } },
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(10);
  });

  it('works with conditional operator (false)', async () => {
    const program = new Program('this.gear.armor ? 10 : 5');
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(5);
  });

  it('works with nested conditional operator (true)', async () => {
    const program = new Program(
      'this.gear.armor ? this.gear.armor ? 10 : 7 : 5',
    );
    const resolution = await program.run(context, {
      this: { gear: { armor: {} } },
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(10);
  });

  it('works with nested conditional operator (false)', async () => {
    const program = new Program(
      'this.gear.armor ? 10 : this.gear.armor ? 7 : 5',
    );
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(5);
  });

  it('works with conditional operator as argument', async () => {
    const program = new Program(
      '(this.gear.armor.armorClass ?? 10) + min(2, this.gear.armor.maxDexterityBonus) + this.gear.shield.armorClass + (this.gear.armor ? this.modifiers.constitution : 0)',
    );
    const resolution = await program.run(context);
    expect(program.errors).toHaveLength(0);
    expect(resolution.value).toBe(12);
  });

  it('works with custom chat message interface', async () => {
    const program = new Program('4d20 + 2');
    const resolution = await program.run({
      ...context,
      chatMessages: {
        dice: function () {
          return this.dice.map((d) => d.value).join(', ');
        },
        binaryOp: (op) =>
          function () {
            const [left, right] = this.of;
            return `${left.toChatMessage()} ${op} ${right.toChatMessage()}`;
          },
      },
    });
    expect(program.errors).toHaveLength(0);
    expect(resolution.toChatMessage(true)).toBe('20, 20, 20, 20 + 2');
  });
});
