import { createTokenizer } from "./tokenize.js";
import { text } from "./state.js";
import { defaultTokenFactory } from "./token.js";
const createMemoizedTokenizer = function tokenizeMemo(createToken = defaultTokenFactory) {
    const cache = {};
    return function* tokenizeMemo(input, initialState = text) {
        const key = `${initialState.name}:${input}`;
        const tokenize = createTokenizer(createToken);
        if (key in cache) {
            for (const token of cache[key].tokens) {
                yield token;
            }
            return cache[key].state;
        }
        const generator = tokenize(input, initialState);
        const tokens = [];
        let result = generator.next();
        while (!result.done) {
            tokens.push(result.value);
            yield result.value;
            result = generator.next();
        }
        const state = result.value;
        cache[key] = { state, tokens };
        return state;
    };
};
export { createMemoizedTokenizer };
