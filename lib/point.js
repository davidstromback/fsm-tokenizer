/**
 * Creates a point.
 */
export function point(offset = 0, line = 0, column = 0) {
    return { line, column, offset };
}
/**
 * Clones a point.
 */
export function clone({ line, column, offset }) {
    return { line, column, offset };
}
/**
 * Copies all values of a point to another point.
 */
export function assign(target, source) {
    target.line = source.line;
    target.column = source.column;
    target.offset = source.offset;
    return target;
}
export const empty = point();
