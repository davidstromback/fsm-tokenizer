import type { Point } from "./types.js";

/**
 * Clones a point.
 */
export function clone(source: Point): Point {
  return {
    line: source.line,
    column: source.column,
    offset: source.offset,
  };
}

/**
 * Copies all values of a point to another point.
 */
export function assign(target: Point, source: Point, ) {
  target.line = source.line;
  target.column = source.column;
  target.offset = source.offset;
}
