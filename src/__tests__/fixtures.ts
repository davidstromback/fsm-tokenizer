import { Tokenizer } from "../types.js";

export function tokenizeResult<Token, StateKey>(
  tokenize: Tokenizer<Token, StateKey>,
  ...inputs: Array<string>
) {
  return inputs.reduce<{ tokens: Array<Token>; state?: StateKey }>(
    (acc, input) => {
      const generator = tokenize(input, acc.state);

      let result = generator.next();

      while (!result.done) {
        acc.tokens.push(result.value);
        result = generator.next();
      }

      acc.state = result.value;

      return acc;
    },
    { tokens: [], state: undefined }
  );
}
