import type { Interpolation, Tokenizer } from "./types.js";

export function* interpolate<T, S>(
  tokenize: Tokenizer<T, S>,
  strings: TemplateStringsArray,
  values: string[]
): Iterable<T | Interpolation> {
  let result = yield* tokenize(strings[0]);

  for (let index = 0; index < values.length; index++) {
    yield { type: "interpolation", value: values[index] };

    result = yield* tokenize(strings[index + 1], result);
  }
}
