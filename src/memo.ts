import type { Tokenizer, TokenizerResult } from "./types.js";

import { empty } from "./point.js";

interface CacheEntry {
  result: TokenizerResult<string>;
  tokens: Array<unknown>;
}

export function memo<StateKey extends keyof any, T>(
  tokenize: Tokenizer<T, StateKey>
): Tokenizer<T, StateKey>;

export function memo(
  tokenize: Tokenizer<unknown, string>
): Tokenizer<unknown, string> {
  const cache: Record<string, CacheEntry> = {};

  return function* tokenizeMemo(input: string, options) {
    const { offset, line, column } = options?.offset ?? empty;
    const key = `${offset}:${line}:${column}:${options?.state ?? ""}:${input}`;

    if (key in cache) {
      for (const token of cache[key].tokens) {
        yield token;
      }

      return cache[key].result;
    }

    const generator = tokenize(input, options);

    const tokens: Array<unknown> = [];

    let result = generator.next();
    while (!result.done) {
      tokens.push(result.value);
      yield result.value;
      result = generator.next();
    }

    cache[key] = { result: result.value, tokens };

    return result.value;
  };
}
