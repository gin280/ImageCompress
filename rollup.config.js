import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import json from "@rollup/plugin-json"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"

export default {
  input: "src/index.js",
  output: {
    file: "dist/compress-img.js",
    format: "umd",
    name: "CompressImg",
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "> 0.25%, not dead",
          },
        ],
      ],
    }),
    terser(),
  ],
}
