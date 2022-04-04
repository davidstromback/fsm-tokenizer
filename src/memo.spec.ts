import { markup } from "./markup.js";
import { memo } from "./memo.js";
import { tokenizer } from "./tokenizer.js";
import { valid, invalid } from "./__tests__/cases.js";
import { tokenizeResult } from "./__tests__/fixtures.js";

describe("tokenize (memo)", () => {
  describe("returns the same tokens on subsequent calls", () => {
    test.each(valid)("%p", (input) => {
      const tokenizeMemo = memo(tokenizer(markup));
      const expected = tokenizeResult(tokenizeMemo, input);
      const actual = tokenizeResult(tokenizeMemo, input);

      expect(actual).toEqual(expected);

      actual.tokens.forEach((token, index) =>
        expect(token).toBe(expected.tokens[index])
      );
    });
  });

  describe("memoized results are equal to unmemoized results", () => {
    test.each(valid)("%p", (input) => {
      const tokenize = tokenizer(markup);
      const tokenizeMemo = memo(tokenizer(markup));

      expect(tokenizeResult(tokenizeMemo, input)).toEqual(
        tokenizeResult(tokenize, input)
      );

      expect(tokenizeResult(tokenizeMemo, input)).toEqual(
        tokenizeResult(tokenize, input)
      );
    });
  });

  describe("throws errors matching snapshots", () => {
    test.each(invalid)("%p", (input) => {
      const tokenizeMemo = memo(tokenizer(markup));

      expect(() => [...tokenizeMemo(input)]).toThrowErrorMatchingSnapshot();
    });
  });
});
