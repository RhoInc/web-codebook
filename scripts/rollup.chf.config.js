import babel from 'rollup-plugin-babel';

module.exports = {
  entry: './src/chartfoundry/util/Renderer.js',
  format: 'umd',
  globals: {
    webcharts: 'webCharts',
    d3: 'd3',
    react: 'React'
  },
  moduleName: 'web-codebook',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ['es2015-rollup']
    })
  ]
}; 
