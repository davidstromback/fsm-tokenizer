import { write } from "./context.js";
import { clone, assign } from "./point.js";
const matchWhitespace = /\s/;
const matchLineBreak = /\n/;
function defaultTokenFactory(type, value, start, end) {
    return { type, value, start: clone(start), end: clone(end) };
}
export function tokenizer(schema, createToken = defaultTokenFactory) {
    return function* tokenize(input, initialState = schema.initialState) {
        var _a;
        const context = {
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
        return ((_a = context.next) !== null && _a !== void 0 ? _a : context.state).key;
    };
}
