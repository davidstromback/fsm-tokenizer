import { CLOSE_MARKER, EQUALS, NAME, QUOTE, TAG_CLOSER, TAG_OPENER, TEXT, VALUE, } from "./token.js";
const noop = function noop() {
    return undefined;
};
const sliceValue = function includeValue(context, start, end) {
    return context.string.slice(start.offset, end.offset + 1);
};
function createTokenIfNotEmpty(context, type, value, start, end) {
    if (start.offset > end.offset) {
        return undefined;
    }
    return context.createToken(type, value, start, end);
}
/**
 * Creates a new finalizer.
 */
function createFinalizer(type, includeValue, includePadding) {
    const getValue = includeValue ? sliceValue : noop;
    if (includePadding) {
        return function createTokenWithPadding(context) {
            return createTokenIfNotEmpty(context, type, getValue(context, context.paddingStart, context.paddingEnd), context.paddingStart, context.paddingEnd);
        };
    }
    return function createTokenWithoutPadding(context) {
        return createTokenIfNotEmpty(context, type, getValue(context, context.contentStart, context.contentEnd), context.contentStart, context.contentEnd);
    };
}
export const finalizeCloseMarker = createFinalizer(CLOSE_MARKER, false, false);
export const finalizeEquals = createFinalizer(EQUALS, false, false);
export const finalizeName = createFinalizer(NAME, true, false);
export const finalizeQuote = createFinalizer(QUOTE, false, false);
export const finalizeTagCloser = createFinalizer(TAG_CLOSER, false, false);
export const finalizeTagOpener = createFinalizer(TAG_OPENER, false, false);
export const finalizeText = createFinalizer(TEXT, true, false);
export const finalizeValue = createFinalizer(VALUE, true, true);
