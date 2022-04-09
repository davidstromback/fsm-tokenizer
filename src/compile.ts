import type {
  Point,
  Rule,
  Schema,
  State,
  Context,
  Finalizer,
} from "./types.js";

import { transition } from "./context.js";

interface TokenOptions {
  value?: boolean;
  padding?: boolean;
}

interface StateOptions<TokenType, StateKey> {
  token?: TokenType;
  rules: Array<[string | RegExp, "before" | "after", StateKey, boolean]>;
}

interface Options<Tokens, States> {
  initialState?: keyof States;
  tokens: Tokens;
  states: States;
}

function noop() {
  return undefined;
}

function slice(context: Context, start: Point, end: Point) {
  return context.string.slice(
    start.offset - context.offset,
    end.offset + 1 - context.offset
  );
}

function contentStart(context: Context) {
  return context.contentStart;
}

function contentEnd(context: Context) {
  return context.contentEnd;
}

function paddingStart(context: Context) {
  return context.paddingStart;
}

function paddingEnd(context: Context) {
  return context.paddingEnd;
}

export function compile<
  Tokens extends Record<string, TokenOptions>,
  States extends Record<string, StateOptions<keyof Tokens, keyof States>>
>(options: Options<Tokens, States>): Schema<keyof Tokens, keyof States>;

export function compile(
  options: Options<
    Record<string, TokenOptions>,
    Record<string, StateOptions<string, string>>
  >
): Schema<string, string> {
  const tokens = Object.fromEntries(
    Object.entries(options.tokens).map(([type, { padding, value }]) => {
      const getValue = value ? slice : noop;
      const getStart = padding ? paddingStart : contentStart;
      const getEnd = padding ? paddingEnd : contentEnd;

      const finalize: Finalizer = function finalize(context: Context) {
        const start = getStart(context);
        const end = getEnd(context);

        if (start.offset > end.offset) {
          return undefined;
        }

        const value = getValue(context, start, end);

        return context.createToken(type, value, start, end);
      };

      finalize.tokenType = type;

      return [type, finalize];
    })
  );

  const states = Object.fromEntries(
    Object.entries(options.states).map(([key, config]) => {
      const rules: Array<Rule> = [];

      const state: State = (context) => {
        for (const rule of rules) {
          if (rule.match.test(context.char)) {
            return rule.apply(context);
          }
        }

        let message = `Unexpected "${context.char}"`;

        if (context.state.finalize.tokenType) {
          message += ` in token "${context.state.finalize.tokenType}"`;
        }

        if (context.state.rules.length === 1) {
          message += `, expected "${context.state.rules[0]}"`;
        } else if (context.state.rules.length > 1) {
          const expected = context.state.rules.map(
            (rule) => `"${rule.match.source}"`
          );

          message += `, expected ${expected
            .slice(1)
            .join(", ")} or ${expected.pop()}`;
        }

        throw new Error(message);
      };

      state.rules = rules;

      state.key = key;

      state.finalize = config.token ? tokens[config.token] : noop;

      return [key, state];
    })
  );

  for (const [key, state] of Object.entries(states)) {
    for (const [match, when, next, commit] of options.states[key].rules) {
      const rule: Rule = {
        match: typeof match === "string" ? new RegExp(match) : match,
        apply: transition(states[next], when, commit),
      };

      state.rules.push(rule);
    }
  }

  const initialState = options.initialState ?? Object.keys(states)[0];

  return { tokens, states, initialState };
}
