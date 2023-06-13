import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'node:fs';
import camelCase from 'camelcase';
import json from '@rollup/plugin-json';

const pkg = JSON.parse(readFileSync('package.json'));

// Human timestamp for banner.
const datetime = new Date().toISOString().substring(0, 19).replace('T', ' ');
const year = datetime.substring(0, 4);

// Remove npm namespace from the package name.
const pkgName = pkg.name.replace(/@.*\//, '');
const name = camelCase(pkgName, { pascalCase: true });

// Main banner.
const banner = `/*! ${name} v${pkg.version} ${datetime}
 *! ${pkg.homepage}
 *! Copyright (C) ${year} ${pkg.author}.
 *! ${pkg.license} license.
 */
`;

// Target ECMAScript version (es2017 is good for all modern browsers in 2023).
const target = 'es2017';

export default [
  {
    input: './src/index.ts',
    output: {
      name,
      file: 'index.min.js',
      // file: `./${pkgName}.min.js`,
      format: 'iife',
      banner,
      sourcemap: true,
    },
    plugins: [
      json(),

      typescript({
        compilerOptions: {
          target,
        },
      }),

      terser({ output: { comments: /^!/ } }),
    ],
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: './index.mjs',
        format: 'esm',
        banner,
        sourcemap: true,
      },
      {
        file: './index.cjs',
        format: 'commonjs',
        banner,
        sourcemap: true,
      },
    ],
    plugins: [
      json(),

      typescript({
        compilerOptions: {
          target,
        },
      }),
    ],
  },
];
