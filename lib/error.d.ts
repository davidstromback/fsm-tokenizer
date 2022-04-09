import type { Point, TokenizationError } from "./types.js";
export declare function tokenizationError(message: string, location: Point): TokenizationError;
export declare function isTokenizationError(error: any): error is TokenizationError;
