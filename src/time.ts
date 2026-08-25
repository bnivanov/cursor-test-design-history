import { positiveInt, year, type PositiveInt, type Year } from "./brand.ts";

export type YearSpan = {
  readonly start: Year;
  readonly durationYears: PositiveInt;
};

export function yearSpan(start: number, durationYears: number): YearSpan {
  return {
    start: year(start),
    durationYears: positiveInt(durationYears),
  };
}

export function spanEnd(span: YearSpan): Year {
  return year((span.start as number) + (span.durationYears as number) - 1);
}

export function compareSpans(
  a: YearSpan,
  b: YearSpan,
  idA: string,
  idB: string,
): number {
  if (a.start !== b.start) {
    return (a.start as number) - (b.start as number);
  }
  if (a.durationYears !== b.durationYears) {
    return (a.durationYears as number) - (b.durationYears as number);
  }
  return idA.localeCompare(idB);
}
