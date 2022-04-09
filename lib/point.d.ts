import type { Point } from "./types.js";
/**
 * Creates a point.
 */
export declare function point(offset?: number, line?: number, column?: number): Point;
/**
 * Clones a point.
 */
export declare function clone(source: Point): Point;
/**
 * Copies all values of a point to another point.
 */
export declare function assign(target: Point, source: Point): Point;
/**
 * Adds the value of a point to an existing point.
 */
export declare function add(target: Point, addend: Point): Point;
export declare const empty: Point;
