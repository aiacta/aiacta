import { EventEmitter } from 'events';

interface Engine<T> {
  subscribe(name: string, cb: (value: T) => void): Promise<number>;
  unsubscribe(id: number): Promise<void>;
}

export class PubSub<T extends Record<string, any> = any> implements Engine<T> {
  async subscribe(eventName: string, cb: (value: T) => void) {
    this.#eventEmitter.on(eventName, cb);
    const subId = this.#idCounter++;
    this.#subscriptions.set(subId, [eventName, cb]);

    return subId;
  }
  async unsubscribe(id: number) {
    const [eventName, cb] = this.#subscriptions.get(id)!;
    this.#eventEmitter.removeListener(eventName, cb);
    this.#subscriptions.delete(id);
  }

  async publish<TEvent extends keyof T & string>(
    eventName: TEvent,
    payload: T[TEvent],
  ) {
    this.#eventEmitter.emit(eventName, payload);
  }

  asyncIterator<TEvent extends keyof T & string, TMapped = T[TEvent]>(
    eventName: TEvent,
    opt: {
      map?: (value: T[TEvent]) => TMapped;
      filter?: (value: T[TEvent]) => boolean;
    },
  ) {
    return new PubSubAsyncIterator<TMapped>(this, eventName, opt);
  }

  #eventEmitter = new EventEmitter();
  #idCounter = 0;
  #subscriptions = new Map<number, [string, (value: T) => void]>();
}

class PubSubAsyncIterator<T, TReturn = T, TNext = unknown>
  implements AsyncIterator<T, TReturn, TNext> {
  constructor(
    engine: Engine<any>,
    eventName: string,
    {
      map,
      filter,
    }: {
      map?: (value: any) => T;
      filter?: (value: any) => boolean;
    },
  ) {
    this.#engine = engine;
    this.#eventName = eventName;
    this.#running = true;
    this.#map = map;
    this.#filter = filter;
  }

  async next(): Promise<IteratorResult<T, TReturn>> {
    if (!this.#subscriptionId) {
      await (this.#subscriptionId = this.#engine.subscribe(
        this.#eventName,
        this.pushValue.bind(this),
      ));
    }
    return this.pullValue();
  }

  async return?(): Promise<IteratorResult<T, TReturn>> {
    await this.emptyQueue();
    return { value: undefined as any, done: true };
  }

  async throw?(error?: any): Promise<IteratorResult<T, TReturn>> {
    await this.emptyQueue();
    return Promise.reject(error);
  }

  [Symbol.asyncIterator]() {
    return this;
  }

  #engine: Engine<T>;
  #eventName: string;
  #subscriptionId: Promise<number> | null = null;
  #queue: ((value: IteratorResult<T, TReturn>) => void)[] = [];
  #values: T[] = [];
  #running = false;
  #map: ((value: any) => T) | undefined;
  #filter: ((value: any) => boolean) | undefined;

  private async pushValue(value: T) {
    if (this.#filter && !this.#filter(value)) {
      return;
    }
    await this.#subscriptionId;
    if (this.#queue.length > 0) {
      this.#queue.shift()!(
        this.#running
          ? { value: this.#map?.(value) ?? value, done: false }
          : { value: undefined as any, done: true },
      );
    } else {
      this.#values.push(value);
    }
  }

  private async pullValue(): Promise<IteratorResult<T, TReturn>> {
    return new Promise((resolve) => {
      if (this.#values.length > 0) {
        const value = this.#values.shift()!;
        resolve(
          this.#running
            ? { value: this.#map?.(value) ?? value, done: false }
            : { value: undefined as any, done: true },
        );
      } else {
        this.#queue.push(resolve);
      }
    });
  }

  private async emptyQueue() {
    if (this.#running) {
      this.#running = false;
      this.#queue.forEach((resolve) =>
        resolve({ value: undefined as any, done: true }),
      );
      this.#queue.length = 0;
      this.#values.length = 0;
      const subscriptionId = await this.#subscriptionId;
      if (typeof subscriptionId === 'number') {
        this.#engine.unsubscribe(subscriptionId);
      }
    }
  }
}
