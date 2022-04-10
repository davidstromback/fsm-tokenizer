import type { Context, Point } from "./types.js";
export declare function format(context: Context): string;
export declare class TokenizationError extends Error {
    location: Point;
    name: string;
    constructor(message: string, location: Point);
}
