import type {
  Point,
  Token,
  TokenFactory,
  Context,
  Tokenizer,
  Schema,
} from "./types.js";

import { write } from "./context.js";
import { assign, clone, empty, point } from "./point.js";

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

const defaultOptions = {};

export function tokenizer<
  TokenType extends keyof any,
  StateKey extends keyof any,
  T = Token<TokenType>
>(
  schema: Schema<TokenType, StateKey>,
  createToken?: TokenFactory<T, TokenType>
): Tokenizer<T, StateKey>;

export function tokenizer(
  schema: Schema<string, string>,
  createToken = defaultTokenFactory
): Tokenizer<unknown, string> {
  return function* tokenize(input, options = defaultOptions) {
    const { state = schema.initialState, offset = empty } = options;

    const context: Context = {
      char: "",
      contentEnd: point(-1),
      contentStart: clone(offset),
      createToken,
      location: clone(offset),
      next: undefined,
      offset: offset.offset,
      paddingEnd: point(-1),
      paddingStart: clone(offset),
      state: schema.states[state],
      string: input,
      token: undefined,
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
        context.location.column = 0;
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

    return {
      state: (context.next ?? context.state).key,
      offset: context.location,
    };
  };
}
