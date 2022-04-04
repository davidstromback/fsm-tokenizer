import { markup } from "./markup.js";
import { tokenizer } from "./tokenizer.js";
import { valid, invalid, split } from "./__tests__/cases.js";
import { tokenizeResult } from "./__tests__/fixtures.js";

describe("tokenizer", () => {
  describe("matches snapshots", () => {
    const tokenize = tokenizer(markup);

    test.each(valid)("%p", (input) => {
      expect(tokenizeResult(tokenize, input)).toMatchSnapshot();
    });
  });

  describe("throws errors matching snapshots", () => {
    const tokenize = tokenizer(markup);

    test.each(invalid)("%p", (input) => {
      expect(() => [...tokenize(input)]).toThrowErrorMatchingSnapshot();
    });
  });

  describe("yields equal results for split strings", () => {
    const tokenize = tokenizer(markup, (type, value) => ({
      type,
      value,
    }));

    test.each(split)("%p", (original, parts) => {
      expect(tokenizeResult(tokenize, ...parts)).toEqual(
        tokenizeResult(tokenize, original)
      );
    });
  });
});
