export interface Interpolation {
    type: "interpolation";
    value: any;
}
/**
 * Represents a location in a string.
 */
export interface Point {
    /**
     * Line, 0-indexed.
     */
    line: number;
    /**
     * Column, 0-indexed.
     */
    column: number;
    /**
     * Offset from the start of the string,
     * 0-indexed.
     */
    offset: number;
}
export interface Schema<TokenType extends keyof any, StateKey extends keyof any> {
    tokens: Record<TokenType, Finalizer>;
    states: Record<StateKey, State>;
    initialState: StateKey;
}
/**
 * A finalized token.
 */
export interface Token<Type> {
    /**
     * The type of the token.
     */
    type: Type;
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
 * Creates a token.
 */
export interface TokenFactory<Token, Type> {
    (type: Type, value: string | undefined, start: Point, end: Point, offset: Point): Token;
}
/**
 * Tokenizes a string and returns the final state.
 */
export interface Tokenizer<Token, StateKey> {
    (string: string, options?: TokenizerOptions<StateKey>): Generator<Token, TokenizerResult<StateKey>, undefined>;
}
export interface TokenizerOptions<StateKey> {
    state?: StateKey;
    offset?: Point;
}
export interface TokenizerResult<StateKey> {
    state: StateKey;
    offset: Point;
}
/**
 * Finalizes the current token.
 */
export interface Finalizer {
    (context: Context): Record<string, any> | undefined;
}
/**
 * A rule consisiting of a regex and a
 * function to invoke if matched.
 */
export interface Rule {
    match: RegExp;
    apply(context: Context): State;
}
/**
 * State machine.
 */
export interface State {
    key: string;
    /**
     * Get the next state.
     */
    (context: Context): State;
    /** Rules to apply when in this state. */
    rules: Array<Rule>;
    /**
     * The finalizer to use when in this state.
     */
    finalize: Finalizer;
}
/**
 * Holds information about the current state of a tokeniser.
 */
export interface Context {
    /**
     * The current state.
     */
    state: State;
    /**
     * If set, write and transition before next char.
     */
    next: State | undefined;
    /**
     * The current location in the string.
     */
    location: Point;
    /**
     * The offset is added to the position of created tokens.
     */
    offset: Point;
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
    char: string;
    /**
     * The token that was written (if any) on the
     * last call to process.
     */
    token: Record<string, any> | undefined;
    createToken: TokenFactory<Record<string, any>, string>;
}
