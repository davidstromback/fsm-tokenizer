import { write } from "./context.js";
import { text } from "./state.js";
import { defaultTokenFactory } from "./token.js";
import { copyPoint } from "./point.js";
import { isBreak, isWhitespace } from "./match.js";
const { charCodeAt } = String.prototype;
export const createTokenizer = function createTokenizer(createToken = defaultTokenFactory) {
    return function* tokenize(input, initialState = text) {
        var _a;
        const context = {
            char: NaN,
            contentEnd: { line: 1, column: 1, offset: -1 },
            contentStart: { line: 1, column: 1, offset: 0 },
            createToken,
            location: { line: 1, column: 1, offset: 0 },
            nextState: undefined,
            paddingEnd: { line: 1, column: 1, offset: -1 },
            paddingStart: { line: 1, column: 1, offset: 0 },
            state: initialState,
            string: input,
            token: undefined,
        };
        for (let index = 0; index < input.length; index++) {
            context.char = charCodeAt.call(input, index);
            context.token = undefined;
            if (context.nextState) {
                write(context);
                context.state = context.nextState;
                context.nextState = undefined;
            }
            context.state = context.state(context);
            copyPoint(context.location, context.paddingEnd);
            context.location.offset++;
            if (isBreak(context.char)) {
                context.location.column = 1;
                context.location.line++;
            }
            else {
                context.location.column++;
            }
            if (isWhitespace(context.char)) {
                if (context.contentEnd.offset < context.paddingStart.offset) {
                    copyPoint(context.location, context.contentStart);
                }
            }
            else {
                copyPoint(context.paddingEnd, context.contentEnd);
            }
            if (context.token) {
                yield context.token;
            }
        }
        write(context);
        if (context.token) {
            yield context.token;
        }
        return (_a = context.nextState) !== null && _a !== void 0 ? _a : context.state;
    };
};
