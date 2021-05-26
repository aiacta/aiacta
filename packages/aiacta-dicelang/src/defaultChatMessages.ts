import { Methods } from './executor';

/** @internal */ export default {
  min: function (isLeaf) {
    return (
      `min(${this.of.map((arg) => arg.toChatMessage()).join(', ')})` +
      (isLeaf ? ` = ${this.value}` : '')
    );
  },
  max: function (isLeaf) {
    return (
      `max(${this.of.map((arg) => arg.toChatMessage()).join(', ')})` +
      (isLeaf ? ` = ${this.value}` : '')
    );
  },
  ceil: function (isLeaf) {
    return (
      `ceil(${this.of[0].toChatMessage()})` + (isLeaf ? ` = ${this.value}` : '')
    );
  },
  floor: function (isLeaf) {
    return (
      `floor(${this.of[0].toChatMessage()})` +
      (isLeaf ? ` = ${this.value}` : '')
    );
  },
  abs: function (isLeaf) {
    return (
      `abs(${this.of[0].toChatMessage()})` + (isLeaf ? ` = ${this.value}` : '')
    );
  },
  identifier: function () {
    return this.name;
  },
  literal: function () {
    return this.value.toString();
  },
  propertyAccess: function (isLeaf) {
    const [o, k] = this.of!;
    return `${o.toChatMessage()}[${k}]` + (isLeaf ? ` = ${this.value}` : '');
  },
  binaryOp: (op) =>
    function (isLeaf) {
      const [l, r] = this.of;
      return (
        `${l.toChatMessage()} ${op} ${r.toChatMessage()}` +
        (isLeaf ? ` = ${this.value}` : '')
      );
    },
  dice: function () {
    return `(${this.dice
      .map(
        (d) =>
          `<Die faces={${d.faces}} value={${d.value}}${
            d.critical ? ' critical' : ''
          }${d.dropped ? ' dropped' : ''} />`,
      )
      .join(', ')})`;
  },
} as Required<Methods['chatMessages']>;
