export function tokenizationError(message, location) {
    return { name: "TokenizationError", message, location };
}
export function isTokenizationError(error) {
    return (error != null &&
        typeof error === "object" &&
        error.name === "TokenizationError");
}
