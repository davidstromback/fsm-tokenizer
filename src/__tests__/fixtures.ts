import { Tokenizer, TokenizerResult } from "../types.js";

export function tokenizeResult<Token, StateKey>(
  tokenize: Tokenizer<Token, StateKey>,
  ...inputs: Array<string>
) {
  return inputs.reduce<{
    tokens: Array<Token>;
    result?: TokenizerResult<StateKey>;
  }>(
    (acc, input) => {
      const generator = tokenize(input, acc.result);

      let result = generator.next();

      while (!result.done) {
        acc.tokens.push(result.value);
        result = generator.next();
      }

      acc.result = result.value;

      return acc;
    },
    { tokens: [], result: undefined }
  );
}
