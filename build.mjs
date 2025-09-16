import * as esbuild from 'esbuild'

esbuild.build({ 
  entryPoints: ['src/test.ts'],
  platform: 'node',
  bundle: true,
  outdir: './dist',
  sourcemap: true,
  target: 'node10',
  minifySyntax:false, 

})
 