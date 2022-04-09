import type { Tokenizer } from "./types.js";
export declare function memo<StateKey extends keyof any, T>(tokenize: Tokenizer<T, StateKey>): Tokenizer<T, StateKey>;
