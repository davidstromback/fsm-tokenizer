import type { State, Context } from "./types.js";
export declare function write(context: Context): void;
export declare function transition(state: State, when: "before" | "after", commit: boolean): (context: Context) => State;
