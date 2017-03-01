import babel from 'rollup-plugin-babel';

module.exports = {
  entry: './src/index.js',
  format: 'iife',
  globals: {
    webcharts: 'webCharts',
    d3: 'd3',
    spikeHistgram: 'spike-histogram'
  },
  moduleName: 'webcodebook',
   plugins: [
    babel(
      {
        "presets": [
          [
            "es2015",
            {
              "modules": false
            }
          ]
        ],
        "plugins": [
          "external-helpers"
        ],
        "exclude": "node_modules/**"
      })
  ]
}; 

