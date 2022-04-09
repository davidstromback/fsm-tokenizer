# FSM Tokenizer

## Create a schema

```ts
import { compile } from "fsm-tokenizer";

const schema = compile({
  tokens: {
    text: { value: true, padding: false },
    tagOpener: { value: false, padding: false },
    tagCloser: { value: false, padding: false },
  },
  states: {
    text: {
      token: "text",
      rules: [
        // If the current char is "<", immediately commit
        // the pending token and switch to the "tagOpener" state
        // before processing it.
        [/</, "before", "tagOpener", true][
          // Else continue processing the current token (don't
          // commit) using the "text" state.
          (/[\S\s]/, "after", "text", false)
        ],
      ],
    },
    tagOpener: {
      token: "tagOpener",
      rules: [
        // After matching a tag opener in this state, commit
        // and switch to "tagCloser" for the next char.
        [/</, "after", "tagCloser", true],
        // If no rules are matched an error will be thrown.
      ],
    },
    tagCloser: {
      token: "tagCloser",
      rules: [
        // If the tag is closed as expected, switch back to "text".
        [/>/, "after", "text", true],
      ],
    },
  },
  initialState: "text",
});
```

Given `Foo<>Bar`, this will yield the following tokens:

```ts
[
  {
    type: "text",
    value: "Foo",
  },
  {
    type: "tagOpener",
    value: undefined,
  },
  {
    type: "tagCloser",
    value: undefined,
  },
  {
    type: "text",
    value: "Bar",
  },
];
```

## Create a tokenizer

```ts
import { tokenizer } from "fsm-tokenizer";

const tokenize = tokenizer(schema);
```

### (Optional) Use a custom token factory

```ts
const tokenize = tokenizer(schema, (type, value) => ({ type, value }));
```

### Create a memoized tokenizer

```ts
import { memo } from "fsm-tokenizer";

const tokenize = memo(tokenizer(schema));
```

## Tokenize a string

Tokenizers returns a generator which can be used to iterate
over the stream of tokens.

```ts
for (const token of tokenize(`Foo<>Bar`)) {
  console.log(token);
}
```

### Tagged template literals

```ts
import { interpolate } from "fsm-tokenizer";

export function template(strings: TemplateStringsArray, ...values: string[]) {
  return interpolate(tokenizer, strings, values);
}
```
