import type { Tokenizer } from "./types.js";
export declare function memo<StateName extends keyof any, T>(tokenize: Tokenizer<T, StateName>): Tokenizer<T, StateName>;
