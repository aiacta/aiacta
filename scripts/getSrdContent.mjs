#!/usr/bin/env zx

import { resolve } from 'path';

const paths = [
  'data/class/class-artificer.json',
  'data/class/class-barbarian.json',
  'data/class/class-bard.json',
  'data/class/class-cleric.json',
  'data/class/class-druid.json',
  'data/class/class-fighter.json',
  'data/class/class-monk.json',
  'data/class/class-mystic.json',
  'data/class/class-paladin.json',
  'data/class/class-ranger.json',
  'data/class/class-rogue.json',
  'data/class/class-rune-scribe.json',
  'data/class/class-sorcerer.json',
  'data/class/class-warlock.json',
  'data/class/class-wizard.json',

  'data/class/class-generic.json',
  'data/class/class-sidekick.json',
];

const classes = [];
const subclasses = [];
const classFeatures = [];
const subclassFeatures = [];

for (const path of paths) {
  const resp = await fetch('https://5e.tools/' + path);
  const data = await resp.json();
  try {
    classes.push(...(data.class?.filter((cls) => cls.srd) ?? []));
    subclasses.push(...(data.subclass?.filter((cls) => cls.srd) ?? []));
    classFeatures.push(...(data.classFeature?.filter((f) => f.srd) ?? []));
    subclassFeatures.push(
      ...(data.subclassFeature?.filter((f) => f.srd) ?? []),
    );
  } catch {}
}

await fs.writeFile(
  resolve(__dirname, '../data/classes.json'),
  JSON.stringify(classes, null, 2),
);
await fs.writeFile(
  resolve(__dirname, '../data/subclasses.json'),
  JSON.stringify(subclasses, null, 2),
);
await fs.writeFile(
  resolve(__dirname, '../data/classFeatures.json'),
  JSON.stringify(classFeatures, null, 2),
);
await fs.writeFile(
  resolve(__dirname, '../data/subclassFeatures.json'),
  JSON.stringify(subclassFeatures, null, 2),
);
