import { enter, exit } from "./context.js";
import { isAlphaNumeric, isCloseMarker, isEquals, isEscape, isLatin, isQuote, isTagCloser, isTagOpener, isWhitespace, } from "./match.js";
import { finalizeCloseMarker, finalizeEquals, finalizeName, finalizeQuote, finalizeTagCloser, finalizeTagOpener, finalizeText, finalizeValue, } from "./finalize.js";
function invalidMessage(context, expected) {
    return (`Invalid char "${String.fromCharCode(context.char)}" ` +
        `at line ${context.location.line}, ` +
        `column ${context.location.column}, ` +
        `expected ${expected}.`);
}
export const name = function name(context) {
    if (isWhitespace(context.char)) {
        return name;
    }
    if (isCloseMarker(context.char)) {
        return enter(context, closeMarker);
    }
    if (isTagCloser(context.char)) {
        return enter(context, tagCloser);
    }
    if (isLatin(context.char)) {
        return enter(context, nameOrEquals);
    }
    throw new Error(invalidMessage(context, "name, close marker (/) or tag closer (>)"));
};
name.finalize = finalizeName;
export const nameOrEquals = function nameOrEquals(context) {
    if (isWhitespace(context.char)) {
        return enter(context, name);
    }
    if (isCloseMarker(context.char)) {
        return enter(context, closeMarker);
    }
    if (isTagCloser(context.char)) {
        return enter(context, tagCloser);
    }
    if (isEquals(context.char)) {
        return enter(context, equals);
    }
    if (isAlphaNumeric(context.char)) {
        return nameOrEquals;
    }
    throw new Error(invalidMessage(context, "name or equals (=)"));
};
nameOrEquals.finalize = finalizeName;
export const closeMarker = function closeMarker(context) {
    return exit(context, name);
};
closeMarker.finalize = finalizeCloseMarker;
export const equals = function equals(context) {
    if (isWhitespace(context.char)) {
        return equals;
    }
    if (isEquals(context.char)) {
        return exit(context, quoteStart);
    }
    return enter(context, name);
};
equals.finalize = finalizeEquals;
export const quoteStart = function quoteStart(context) {
    if (isWhitespace(context.char)) {
        return quoteStart;
    }
    if (isQuote(context.char)) {
        return exit(context, value);
    }
    return enter(context, name);
};
quoteStart.finalize = finalizeQuote;
export const quoteEnd = function quoteEnd(context) {
    return exit(context, name);
};
quoteEnd.finalize = finalizeQuote;
export const tagCloser = function tagCloser(context) {
    return exit(context, text);
};
tagCloser.finalize = finalizeTagCloser;
export const tagOpener = function tagOpener(context) {
    return exit(context, name);
};
tagOpener.finalize = finalizeTagOpener;
export const escapeText = function escapeText() {
    return text;
};
escapeText.finalize = finalizeText;
export const text = function text(context) {
    if (isEscape(context.char)) {
        return escapeText;
    }
    if (isTagOpener(context.char)) {
        return enter(context, tagOpener);
    }
    return text;
};
text.finalize = finalizeText;
export const escapeValue = function escapeValue() {
    return value;
};
escapeValue.finalize = finalizeValue;
export const value = function value(context) {
    if (isEscape(context.char)) {
        return escapeValue;
    }
    if (isQuote(context.char)) {
        return enter(context, quoteEnd);
    }
    return value;
};
value.finalize = finalizeValue;
