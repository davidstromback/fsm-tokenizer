/**
 * Creates a point.
 */
export function point(offset = 0, line = 0, column = 0) {
    return { line, column, offset };
}
/**
 * Clones a point.
 */
export function clone(source) {
    return {
        line: source.line,
        column: source.column,
        offset: source.offset,
    };
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
/**
 * Adds the value of a point to an existing point.
 */
export function add(target, addend) {
    target.line += addend.line;
    target.column += addend.column;
    target.offset += addend.offset;
    return target;
}
export const empty = point();
