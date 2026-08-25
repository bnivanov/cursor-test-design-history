import { nonEmptyString, year, type NonEmptyString, type Year } from "./brand.ts";

export type WorkRef =
  | { readonly kind: "url"; readonly href: NonEmptyString }
  | { readonly kind: "archive"; readonly href: NonEmptyString; readonly captured: Year }
  | { readonly kind: "publication"; readonly title: NonEmptyString; readonly publisher: NonEmptyString; readonly published: Year }
  | { readonly kind: "unarchived" };

export type Work = {
  readonly title: NonEmptyString;
  readonly year: Year;
  readonly credit: NonEmptyString;
  readonly ref: WorkRef;
};

export type HumanHistory = {
  readonly summary: NonEmptyString;
  readonly essay: NonEmptyString;
};

export function work(input: {
  title: string;
  year: number;
  credit: string;
  ref: WorkRef;
}): Work {
  return {
    title: nonEmptyString(input.title),
    year: year(input.year),
    credit: nonEmptyString(input.credit),
    ref: input.ref,
  };
}

export function liveUrl(href: string): WorkRef {
  return { kind: "url", href: nonEmptyString(href) };
}

export function archiveUrl(href: string, captured: number): WorkRef {
  return {
    kind: "archive",
    href: nonEmptyString(href),
    captured: year(captured),
  };
}

export function publication(
  title: string,
  publisher: string,
  published: number,
): WorkRef {
  return {
    kind: "publication",
    title: nonEmptyString(title),
    publisher: nonEmptyString(publisher),
    published: year(published),
  };
}

export function history(summary: string, essay: string): HumanHistory {
  return {
    summary: nonEmptyString(summary),
    essay: nonEmptyString(essay),
  };
}
