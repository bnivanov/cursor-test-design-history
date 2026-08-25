export type Brand<T, B extends string> = T & { readonly __brand: B };

export type MovementId = Brand<string, "MovementId">;
export type NonEmptyString = Brand<string, "NonEmptyString">;
export type CssColor = Brand<string, "CssColor">;
export type CssFamily = Brand<string, "CssFamily">;
export type Year = Brand<number, "Year">;
export type PositiveInt = Brand<number, "PositiveInt">;

export function movementId(raw: string): MovementId {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw)) {
    throw new Error(`bad movement id: ${raw}`);
  }
  return raw as MovementId;
}

export function nonEmptyString(raw: string): NonEmptyString {
  const value = raw.trim();
  if (value.length < 1) {
    throw new Error("empty string");
  }
  return value as NonEmptyString;
}

export function cssColor(raw: string): CssColor {
  if (!/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw)) {
    throw new Error(`bad color: ${raw}`);
  }
  return raw.toLowerCase() as CssColor;
}

export function cssFamily(raw: string): CssFamily {
  const value = raw.trim();
  if (value.length < 1) {
    throw new Error("empty font family");
  }
  return value as CssFamily;
}

export function year(raw: number): Year {
  if (!Number.isInteger(raw) || raw < 1989 || raw > 2030) {
    throw new Error(`bad year: ${raw}`);
  }
  return raw as Year;
}

export function positiveInt(raw: number): PositiveInt {
  if (!Number.isInteger(raw) || raw < 1) {
    throw new Error(`bad positive int: ${raw}`);
  }
  return raw as PositiveInt;
}

export function assertNever(value: never): never {
  throw new Error(`unhandled: ${String(value)}`);
}
