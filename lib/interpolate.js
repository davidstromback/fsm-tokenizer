export function* interpolate(tokenize, strings, values) {
    let result = yield* tokenize(strings[0]);
    for (let index = 0; index < values.length; index++) {
        yield {
            type: "interpolation",
            value: values[index],
            start: result.offset,
            end: result.offset,
        };
        result = yield* tokenize(strings[index + 1], result);
    }
}
