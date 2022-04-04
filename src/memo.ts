import type { Token, Tokenizer } from "./types.js";

export function memo<StateName extends keyof any, T>(
  tokenize: Tokenizer<T, StateName>
): Tokenizer<T, StateName>;

export function memo(tokenize: Tokenizer<Token<string>, string>) {
  const cache: Record<string, { state: string; tokens: Array<any> }> = {};

  return function* tokenizeMemo(input: string, initialState: string) {
    const key = `${initialState}:${input}`;

    if (key in cache) {
      for (const token of cache[key].tokens) {
        yield token;
      }

      return cache[key].state;
    }

    const generator = tokenize(input, initialState);

    const tokens: Array<any> = [];

    let result = generator.next();
    while (!result.done) {
      tokens.push(result.value);
      yield result.value;
      result = generator.next();
    }

    const state = result.value;

    cache[key] = { state, tokens };

    return state;
  };
}
