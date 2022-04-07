import type { Schema } from "./types.js";
interface TokenOptions {
    value?: boolean;
    padding?: boolean;
}
interface StateOptions<TokenType, StateKey> {
    token?: TokenType;
    rules: Array<[string | RegExp, "before" | "after", StateKey, boolean]>;
}
interface Options<Tokens, States> {
    initialState?: keyof States;
    tokens: Tokens;
    states: States;
}
export declare function compile<Tokens extends Record<string, TokenOptions>, States extends Record<string, StateOptions<keyof Tokens, keyof States>>>(options: Options<Tokens, States>): Schema<keyof Tokens, keyof States>;
export {};
