import type { Point } from "./types.js";

/**
 * Creates a point.
 */
export function point(offset = 0, line = 0, column = 0): Point {
  return { line, column, offset };
}

/**
 * Clones a point.
 */
export function clone({ line, column, offset }: Point): Point {
  return { line, column, offset };
}

/**
 * Copies all values of a point to another point.
 */
export function assign(target: Point, source: Point) {
  target.line = source.line;
  target.column = source.column;
  target.offset = source.offset;

  return target;
}

export const empty = point();
