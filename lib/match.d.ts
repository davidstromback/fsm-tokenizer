interface Matcher {
    (char: number): boolean;
}
/** \n */
export declare const isBreak: Matcher;
/** / */
export declare const isCloseMarker: Matcher;
/** = */
export declare const isEquals: Matcher;
/** \\ */
export declare const isEscape: Matcher;
/** " */
export declare const isQuote: Matcher;
/** " " */
export declare const isSpace: Matcher;
/** \> */
export declare const isTagCloser: Matcher;
/** < */
export declare const isTagOpener: Matcher;
/** a-z */
export declare const isLatinLowerCase: Matcher;
/** A-Z */
export declare const isLatinUpperCase: Matcher;
/** 0-9 */
export declare const isNumeric: Matcher;
/** a-z, A-Z */
export declare const isLatin: Matcher;
/** a-z, A-Z, 0-9 */
export declare const isAlphaNumeric: Matcher;
/** a-z, A-Z, 0-9 */
export declare const isWhitespace: Matcher;
export {};
