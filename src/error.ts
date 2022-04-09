import type { Context, Point, Rule } from "./types.js";

function rule(rule: Rule) {
  return `"${rule.match.source}"`;
}

export function format(context: Context) {
  let message = `Unexpected "${context.char}"`;

  if (context.state.finalize.tokenType) {
    message += ` in token "${context.state.finalize.tokenType}"`;
  }

  if (context.state.rules.length === 1) {
    message += `, expected "${context.state.rules[0]}"`;
  } else if (context.state.rules.length > 1) {
    const rules = context.state.rules.map(rule);
    const last = rules.pop();

    message += `, expected ${rules.join(", ")} or ${last}`;
  }

  message += ".";

  return message;
}

export class TokenizationError extends Error {
  name = "TokenizationError";

  constructor(message: string, public location: Point) {
    super(message);
  }
}
