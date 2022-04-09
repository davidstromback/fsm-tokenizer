import type { Token, TokenFactory, Tokenizer, Schema } from "./types.js";
export declare function tokenizer<TokenType extends keyof any, StateKey extends keyof any, T = Token<TokenType>>(schema: Schema<TokenType, StateKey>, createToken?: TokenFactory<T, TokenType>): Tokenizer<T, StateKey>;
