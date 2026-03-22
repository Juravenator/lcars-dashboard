import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
	output: {
		format: 'iife',
    // format: 'es',
    compact: true,
    sourcemap: false,
	},
  plugins: [
    nodeResolve(),
    terser()
  ]
};
