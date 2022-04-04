import type { State, Context } from "./types.js";

import { assign } from "./point.js";

export function write(context: Context): void {
  context.token = context.state.finalize(context);

  assign(context.paddingStart, context.location);
  assign(context.contentStart, context.location);
}

export function transition(
  state: State,
  event?: "continue" | "before" | "after",
  commit?: boolean
) {
  if (event === "continue") {
    return function noop() {
      return state;
    };
  }

  if (event === "before") {
    function delegate(context: Context) {
      context.state = state;

      return state(context);
    }

    if (commit) {
      return function commit(context: Context) {
        if (!context.token) {
          write(context);
        }

        return delegate(context);
      };
    }

    return delegate;
  }

  if (commit) {
    return function enqueueWrite(context: Context) {
      context.next = state;

      return context.state;
    };
  }

  return function enqueue() {
    return state;
  };
}
