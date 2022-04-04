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
}
