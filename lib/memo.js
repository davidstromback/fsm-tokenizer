import { empty } from "./point.js";
export function memo(tokenize) {
    const cache = {};
    return function* tokenizeMemo(input, options) {
        var _a, _b;
        const { offset, line, column } = (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : empty;
        const key = `${offset}:${line}:${column}:${(_b = options === null || options === void 0 ? void 0 : options.state) !== null && _b !== void 0 ? _b : ""}:${input}`;
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
