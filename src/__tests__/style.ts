import { compile } from "../compile.js";

export const style = compile({
  initialState: "selector",
  tokens: {
    selector: { value: true },
    declarationOpener: {},
    declarationCloser: {},
    name: { value: true },
    valueOpener: {},
    valueCloser: {},
    value: { value: true },
    quote: {},
    quotedValue: { value: true, padding: true },
  },
  states: {
    selector: {
      token: "selector",
      rules: [
        [/{/, "before", "declarationOpener"],
        [/[\s\S]/, "continue"],
      ],
    },
    declarationOpener: {
      token: "declarationOpener",
      rules: [[/{/, "after", "name"]],
    },
    nameOrDeclarationCloser: {
      token: "name",
      rules: [
        [/}/, "before", "declarationCloser"],
        [/\S/, "before", "name"],
        [/\s/, "continue"],
      ],
    },
    name: {
      token: "name",
      rules: [
        [/:/, "before", "valueOpener"],
        [/\s/, "before", "valueOpener"],
        [/\S/, "continue"],
      ],
    },
    valueOpener: {
      token: "valueOpener",
      rules: [
        [/:/, "after", "value"],
        [/\s/, "continue"],
      ],
    },
    value: {
      token: "value",
      rules: [
        [/"/, "before", "openingQuote"],
        [/;/, "before", "valueCloser"],
        [/[\s\S]/, "continue"],
      ],
    },
    openingQuote: {
      token: "quote",
      rules: [[/"/, "after", "quotedValue"]],
    },
    quotedValue: {
      token: "value",
      rules: [
        [/"/, "before", "valueCloser"],
        [/[\s\S]/, "continue"],
      ],
    },
    closingQuote: {
      token: "quote",
      rules: [[/"/, "after", "value"]],
    },
    valueCloser: {
      token: "valueCloser",
      rules: [[/;/, "after", "name"]],
    },
    declarationCloser: {
      token: "declarationCloser",
      rules: [[/}/, "after", "selector"]],
    },
  },
});
