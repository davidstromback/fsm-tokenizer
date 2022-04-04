export function memo(tokenize) {
    const cache = {};
    return function* tokenizeMemo(input, initialState) {
        const key = `${initialState}:${input}`;
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
}
