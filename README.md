# FSM Tokenizer

## Create a schema

```ts
import { compile } from 'fsm-tokenizer'

const schema = compile({
    tokens: {
        text: { value: true; padding: false; },
        tagOpener: { value: false; padding: false; },
        tagCloser: { value: false; padding: false; }
    },
    states: {
        text: {
            token: 'text',
            rules: [
                // If the current char is "<", immediately commit
                // the pending token and switch to the "tag" state
                // before processing it.
                [/</, 'before', 'tagOpener', true]
                // Else continue processing the current token (don't
                // commit) using the "body" state.
                [/[\S\s]/, 'after', 'text', false],
            ]
        },
        tagOpener: {
            token: 'tagOpener',
            rules: [
                // After matching a tag opener in this state, commit
                // and switch to "tagCloser" for the next char.
                [/</, 'after', 'tagCloser', true]
                // If no rules are matched an error will be thrown.
            ]
        },
        tagCloser: {
            token: 'tagCloser',
            rules: [
                // If the tag is closed as expected, switch back to "text".
                [/>/, 'after', 'text', true]
            ]
        }
    },
    initialState: 'text'
})
```

Given ```Foo<>Bar```, this will yield the following tokens:
```ts
[
    {
        type: 'text',
        value: 'Foo'
    },
    {
        type: 'tagOpener',
        value: undefined
    },
    {
        type: 'tagCloser',
        value: undefined
    },
    {
        type: 'text',
        value: 'Bar'
    }
]
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
import { memo } from 'fsm-tokenizer'

const tokenize = memo(tokenizer())
```

## Tokenize a string
Tokenizers returns a generator which can be used to iterate 
over the stream of tokens. When the end of the string is reached (done = true)
the name of the final state will be returned. This value can be passed to the
tokenizer as the initial state in order to "resume" tokenization of the same 
document.

```ts
for (const token of tokenize(`Foo<>Bar`)) {
    console.log(token)
}
```


### Preserve state between strings when parsing template literals

When parsing template literals, it can be useful to inject interpolations
into the stream of tokens, this can be elegantly handled by using the yield*
keyord.
```ts
export function* interpolate(
  strings: TemplateStringsArray,
  ...values: string[]
) {
  let state = yield* tokenize(strings[0]);

  for (let index = 0; index < values.length; index++) {
    yield { type: 'interpolations', value: values[index] };

    state = yield* tokenize(strings[index + 1], state);
  }
}
```

Note: The to/from position will reset at the start of each string,
either omit them using a custom token factory, or track the
accumulated values manually. 