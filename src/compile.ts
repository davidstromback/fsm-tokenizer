import type { Point, Rule, Schema, State, Context } from "./types.js";

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
  return context.string.slice(start.offset, end.offset + 1);
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

      function finalize(context: Context) {
        const start = getStart(context);
        const end = getEnd(context);

        if (start.offset > end.offset) {
          return undefined;
        }

        const value = getValue(context, start, end);

        return context.createToken(type, value, start, end);
      }

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

        const message =
          `Invalid "${context.char}" ` +
          `at line ${context.location.line}, ` +
          `column ${context.location.column}, ` +
          `expected ${context.state.rules
            .map((rule) => `"${rule.match.source}"`)
            .join(", ")}.`;

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
      state.rules.push({
        match: typeof match === "string" ? new RegExp(match) : match,
        apply: transition(states[next], when, commit),
      });
    }
  }

  const initialState = options.initialState ?? Object.keys(states)[0];

  return { tokens, states, initialState };
}
