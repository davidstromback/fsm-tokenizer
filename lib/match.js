function code(match) {
    return function matchChar(char) {
        return char === match;
    };
}
function range(min, max) {
    return function matchRange(char) {
        return char >= min && char <= max;
    };
}
/** \n */
export const isBreak = code(10);
/** / */
export const isCloseMarker = code(47);
/** = */
export const isEquals = code(61);
/** \\ */
export const isEscape = code(92);
/** " */
export const isQuote = code(34);
/** " " */
export const isSpace = code(32);
/** \> */
export const isTagCloser = code(62);
/** < */
export const isTagOpener = code(60);
/** a-z */
export const isLatinLowerCase = range(97, 122);
/** A-Z */
export const isLatinUpperCase = range(65, 90);
/** 0-9 */
export const isNumeric = range(48, 57);
/** a-z, A-Z */
export const isLatin = function isLatin(char) {
    return isLatinLowerCase(char) || isLatinUpperCase(char);
};
/** a-z, A-Z, 0-9 */
export const isAlphaNumeric = function isAlphaNumeric(char) {
    return isNumeric(char) || isLatin(char);
};
/** a-z, A-Z, 0-9 */
export const isWhitespace = function isWhitespace(char) {
    return isSpace(char) || isBreak(char);
};
