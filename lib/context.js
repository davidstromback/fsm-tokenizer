import { copyPoint } from "./point.js";
/**
 * Finalizes the pending token and writes it to the context.
 */
export function write(context) {
    context.token = context.state.finalize(context);
    copyPoint(context.location, context.paddingStart);
    copyPoint(context.location, context.contentStart);
}
/**
 * Enter a new token before processing the current char.
 */
export function enter(context, state) {
    if (!context.token) {
        write(context);
    }
    context.state = state;
    return state(context);
}
/**
 * Exit the current token before processing the next char.
 */
export function exit(context, state) {
    context.nextState = state;
    return context.state;
}
