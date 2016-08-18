module.exports = {
  entry: './src/wrapper.js',
  format: 'iife',
  globals: {
    webcharts: 'webCharts',
    d3: 'd3'
  },
  moduleName: 'yourModuleName'
}; 