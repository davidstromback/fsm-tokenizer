import { assign } from "./point.js";
export function write(context) {
    context.token = context.state.finalize(context);
    assign(context.paddingStart, context.location);
    assign(context.contentStart, context.location);
}
export function transition(state, when, commit) {
    if (when === "before") {
        function delegate(context) {
            context.state = state;
            return state(context);
        }
        if (commit) {
            return function commit(context) {
                if (!context.token) {
                    write(context);
                }
                return delegate(context);
            };
        }
        return delegate;
    }
    if (commit) {
        return function enqueueWrite(context) {
            context.next = state;
            return context.state;
        };
    }
    return function enqueue() {
        return state;
    };
}
