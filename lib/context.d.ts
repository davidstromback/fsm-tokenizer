import type { State, TokenizeContext } from "./types.js";
/**
 * Finalizes the pending token and writes it to the context.
 */
export declare function write<T>(context: TokenizeContext<T>): void;
/**
 * Enter a new token before processing the current char.
 */
export declare function enter<T>(context: TokenizeContext<T>, state: State): State;
/**
 * Exit the current token before processing the next char.
 */
export declare function exit<T>(context: TokenizeContext<T>, state: State): State;
