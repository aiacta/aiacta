export function isTruthy<T>(d: T | null | undefined | ''): d is T {
  return !!d;
}
