import { transition } from "./context.js";
import { format, TokenizationError } from "./error.js";
function noop() {
    return undefined;
}
function slice(context, start, end) {
    return context.string.slice(start.offset - context.offset, end.offset + 1 - context.offset);
}
function contentStart(context) {
    return context.contentStart;
}
function contentEnd(context) {
    return context.contentEnd;
}
function paddingStart(context) {
    return context.paddingStart;
}
function paddingEnd(context) {
    return context.paddingEnd;
}
export function compile(options) {
    var _a;
    const tokens = Object.fromEntries(Object.entries(options.tokens).map(([type, { padding, value }]) => {
        const getValue = value ? slice : noop;
        const getStart = padding ? paddingStart : contentStart;
        const getEnd = padding ? paddingEnd : contentEnd;
        const finalize = function finalize(context) {
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
    }));
    const states = Object.fromEntries(Object.entries(options.states).map(([key, config]) => {
        const rules = [];
        const state = (context) => {
            for (const rule of rules) {
                if (rule.match.test(context.char)) {
                    return rule.apply(context);
                }
            }
            throw new TokenizationError(format(context), context.location);
        };
        state.rules = rules;
        state.key = key;
        state.finalize = config.token ? tokens[config.token] : noop;
        return [key, state];
    }));
    for (const [key, state] of Object.entries(states)) {
        for (const [match, when, next, commit] of options.states[key].rules) {
            state.rules.push({
                match: typeof match === "string" ? new RegExp(match) : match,
                apply: transition(states[next], when, commit),
            });
        }
    }
    const initialState = (_a = options.initialState) !== null && _a !== void 0 ? _a : Object.keys(states)[0];
    return { tokens, states, initialState };
}
