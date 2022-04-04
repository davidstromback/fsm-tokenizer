import type { Token, TokenFactory, Tokenizer, Schema } from "./types.js";
export declare function tokenizer<TokenType extends keyof any, StateName extends keyof any, T = Token<TokenType>>(schema: Schema<TokenType, StateName>, createToken?: TokenFactory<T, TokenType>): Tokenizer<T, StateName>;
