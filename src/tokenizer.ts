import type {
  Point,
  Token,
  TokenFactory,
  Context,
  Tokenizer,
  Schema,
} from "./types.js";

import { write } from "./context.js";
import { clone, assign } from "./point.js";

const matchWhitespace = /\s/;
const matchLineBreak = /\n/;

function defaultTokenFactory<T>(
  type: T,
  value: string | undefined,
  start: Point,
  end: Point
): Token<T> {
  return { type, value, start: clone(start), end: clone(end) };
}

export function tokenizer<
  TokenType extends keyof any,
  StateName extends keyof any,
  T = Token<TokenType>
>(
  schema: Schema<TokenType, StateName>,
  createToken?: TokenFactory<T, TokenType>
): Tokenizer<T, StateName>;

export function tokenizer(
  schema: Schema<string, string>,
  createToken = defaultTokenFactory
): Tokenizer<Record<string, any>, string> {
  return function* tokenize(input, initialState = schema.initialState) {
    const context: Context = {
      char: "",
      contentEnd: { line: 1, column: 1, offset: -1 },
      contentStart: { line: 1, column: 1, offset: 0 },
      location: { line: 1, column: 1, offset: 0 },
      next: undefined,
      paddingEnd: { line: 1, column: 1, offset: -1 },
      paddingStart: { line: 1, column: 1, offset: 0 },
      state: schema.states[initialState],
      string: input,
      token: undefined,
      createToken,
    };

    for (let index = 0; index < input.length; index++) {
      context.char = input[index];
      context.token = undefined;

      if (context.next) {
        write(context);
        context.state = context.next;
        context.next = undefined;
      }

      context.state = context.state(context);

      assign(context.paddingEnd, context.location);

      context.location.offset++;

      if (matchLineBreak.test(context.char)) {
        context.location.column = 1;
        context.location.line++;
      } else {
        context.location.column++;
      }

      if (matchWhitespace.test(context.char)) {
        if (context.contentEnd.offset < context.paddingStart.offset) {
          assign(context.contentStart, context.location);
        }
      } else {
        assign(context.contentEnd, context.paddingEnd);
      }

      if (context.token) {
        yield context.token;
      }
    }

    write(context);

    if (context.token) {
      yield context.token;
    }

    return (context.next ?? context.state).key;
  };
}
