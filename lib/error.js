function rule(rule) {
    return `"${rule.match.source}"`;
}
export function format(context) {
    let message = `Unexpected "${context.char}"`;
    if (context.state.finalize.tokenType) {
        message += ` in token "${context.state.finalize.tokenType}"`;
    }
    if (context.state.rules.length === 1) {
        message += `, expected "${context.state.rules[0]}"`;
    }
    else if (context.state.rules.length > 1) {
        const rules = context.state.rules.map(rule);
        const last = rules.pop();
        message += `, expected ${rules.join(", ")} or ${last}`;
    }
    message += ".";
    return message;
}
export class TokenizationError extends Error {
    constructor(message, location) {
        super(message);
        this.location = location;
        this.name = "TokenizationError";
    }
}
