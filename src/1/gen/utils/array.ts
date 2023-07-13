


export function arrayRange(size: number, startAt = 0): ReadonlyArray<number> {
  return [...Array(size).keys()].map((i) => i + startAt);
}

