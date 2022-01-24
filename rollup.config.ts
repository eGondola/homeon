import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "frontend/index.ts",
    output: {
        file: "frontend/public/bundle.js",
        format: "iife",
    },
    plugins: [
        svelte({
            preprocess: sveltePreprocess(),
        }),
        resolve({ browser: true }),
        typescript(),
        css(),
    ],
};
