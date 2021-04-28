# dicelang

## Installation

```bash
yarn add @aiacta/dicelang
```

## Usage

```ts
import Program from '@aiacta/dicelang';

...

const resolution = await new Program('1d20').run();
resolution.value //? 7
```

Alternatively you can provide a custom implementation for rolling dice:

```ts
import Program from '@aiacta/dicelang';

...

const resolution = await new Program('1d20').run({
  async roll(faces: number) {
    return 19; // always so close...
  },
});
resolution.value //? 19
```

## Features
