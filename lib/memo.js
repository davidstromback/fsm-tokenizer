import { empty } from "./point.js";
const defaultOptions = {};
export function memo(tokenize) {
    const cache = {};
    return function* tokenizeMemo(input, options = defaultOptions) {
        const { state = "", offset: { offset, line, column } = empty } = options;
        const key = `${offset}:${line}:${column}:${state}:${input}`;
        if (key in cache) {
            for (const token of cache[key].tokens) {
                yield token;
            }
            return cache[key].result;
        }
        const generator = tokenize(input, options);
        const tokens = [];
        let result = generator.next();
        while (!result.done) {
            tokens.push(result.value);
            yield result.value;
            result = generator.next();
        }
        cache[key] = { result: result.value, tokens };
        return result.value;
    };
}
