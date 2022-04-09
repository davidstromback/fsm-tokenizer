import { write } from "./context.js";
import { add, assign, clone, empty, point } from "./point.js";
const matchWhitespace = /\s/;
const matchLineBreak = /\n/;
function defaultTokenFactory(type, value, start, end, offset) {
    return {
        type,
        value,
        start: add(clone(start), offset),
        end: add(clone(end), offset),
    };
}
export function tokenizer(schema, createToken = defaultTokenFactory) {
    return function* tokenize(input, options) {
        var _a, _b, _c;
        const context = {
            char: "",
            contentEnd: point(-1),
            contentStart: point(),
            createToken,
            location: point(),
            next: undefined,
            offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : empty,
            paddingEnd: point(-1),
            paddingStart: point(),
            state: schema.states[(_b = options === null || options === void 0 ? void 0 : options.state) !== null && _b !== void 0 ? _b : schema.initialState],
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
            }
            else {
                context.location.column++;
            }
            if (matchWhitespace.test(context.char)) {
                if (context.contentEnd.offset < context.paddingStart.offset) {
                    assign(context.contentStart, context.location);
                }
            }
            else {
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
            state: ((_c = context.next) !== null && _c !== void 0 ? _c : context.state).key,
            offset: add(context.location, context.offset),
        };
    };
}
