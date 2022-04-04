import { clonePoint } from "./point.js";
export const CLOSE_MARKER = 0;
export const EQUALS = 1;
export const NAME = 2;
export const QUOTE = 3;
export const TAG_CLOSER = 4;
export const TAG_OPENER = 5;
export const TEXT = 6;
export const VALUE = 7;
export const defaultTokenFactory = function createToken(type, value, start, end) {
    return { type, value, start: clonePoint(start), end: clonePoint(end) };
};
