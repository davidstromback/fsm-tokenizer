/** Close marker (/). */
export declare type CloseMarker = 0;
/** Equals sign (=). */
export declare type Equals = 1;
/** Tag or attribute name. */
export declare type Name = 2;
/** Closing quotation mark. */
export declare type Quote = 3;
/** Tag closer (\>). */
export declare type TagCloser = 4;
/** Tag opener (<). */
export declare type TagOpener = 5;
/** Body text. */
export declare type Text = 6;
/** Attribute value. */
export declare type Value = 7;
/** Any token type. */
export declare type TokenType = CloseMarker | Equals | Name | Quote | TagCloser | TagOpener | Text | Value;
/**
 * Tokenizes a string and returns the final state.
 */
export interface Tokenizer<T> {
    (string: string, state?: State): Generator<T, State, undefined>;
}
/**
 * Creates a new tokenizer.
 */
export interface TokenizerFactory {
    (): Tokenizer<Token>;
    <T>(createToken: TokenFactory<T>): Tokenizer<T>;
}
/**
 * Creates a token.
 */
export interface TokenFactory<T> {
    (type: TokenType, value: string | undefined, start: Point, end: Point): T;
}
/**
 * Finalizes the current token.
 */
export interface Finalizer {
    <T>(context: TokenizeContext<T>): T | undefined;
}
/**
 * State machine.
 */
export interface State {
    /**
     * Get the next state.
     */
    <T>(context: TokenizeContext<T>): State;
    /**
     * The finalizer to use when in this state.
     */
    finalize: Finalizer;
}
/**
 * Represents a location in a string.
 */
export interface Point {
    /**
     * Line, 1-indexed.
     */
    line: number;
    /**
     * Column, 1-indexed.
     */
    column: number;
    /**
     * Offset from the start of the string,
     * 1-indexed.
     */
    offset: number;
}
/**
 * A finalized token.
 */
export interface Token {
    /**
     * The type of the token.
     */
    type: TokenType;
    /**
     * The token string value.
     */
    value: string | undefined;
    /**
     * The start location of the token.
     */
    start: Point;
    /**
     * The end location of the token.
     */
    end: Point;
}
/**
 * Holds information about the current state of a tokeniser.
 */
export interface TokenizeContext<T> {
    /**
     * The current state.
     */
    state: State;
    /**
     * If this variable is set, a state transition
     * will take place before processing the next
     * char.
     */
    nextState: State | undefined;
    /**
     * The current location in the string.
     */
    location: Point;
    /**
     * The location of the first non-whitespace
     * char in the current token.
     */
    contentStart: Point;
    /**
     * The location of the last non-whitespace
     * char in the current token.
     */
    contentEnd: Point;
    /**
     * The start of the current token.
     */
    paddingStart: Point;
    /**
     * The location of the previous char.
     */
    paddingEnd: Point;
    /**
     * The string being processed.
     */
    string: string;
    /**
     * The current char being processed.
     */
    char: number;
    /**
     * The token that was written (if any) on the
     * last call to process.
     */
    token: T | undefined;
    /**
     * The function used to create tokens.
     */
    createToken: TokenFactory<T>;
}
