import { createChart } from 'webcharts';
import { multiply } from 'webcharts';
import indicateLoading from '../util/indicateLoading';
import clone from '../util/clone';
import chartMakerSettings from './chartMakerSettings.js';
import makeSettings from './makeSettings.js';

export function draw(codebook) {
  indicateLoading(codebook, '.web-codebook .chartMaker');
  const chartMaker = codebook.chartMaker;

  //clear current chart
  chartMaker.chartWrap.selectAll('*').remove();

  //get selected variable objects
  var x_var = chartMaker.controlsWrap
    .select('.column-select.x select')
    .property('value');
  var x_obj = codebook.data.summary.filter(f => f.label == x_var)[0];

  var y_var = chartMaker.controlsWrap
    .select('.column-select.y select')
    .property('value');
  var y_obj = codebook.data.summary.filter(f => f.label == y_var)[0];

  //get settings and data for the chart
  chartMaker.chartSettings = makeSettings(chartMakerSettings, x_obj, y_obj);
  chartMaker.chartData = clone(codebook.data.filtered);

  //flag highlighted rows
  var highlightedRows = codebook.data.highlighted.map(
    m => m['web-codebook-index']
  );
  chartMaker.chartData.forEach(function(d) {
    d.highlight = highlightedRows.indexOf(d['web-codebook-index']) > -1;
  });

  //Define chart.
  chartMaker.chart = createChart(
    '.web-codebook .chartMaker.section .cm-chart',
    chartMaker.chartSettings
  );
  if (codebook.config.group) {
    chartMaker.chart.on('draw', function() {
      var level = this.wrap.select('.wc-chart-title').text();
      this.wrap
        .select('.wc-chart-title')
        .text(codebook.config.group + ': ' + level);
    });
    multiply(chartMaker.chart, chartMaker.chartData, codebook.config.group);
  } else {
    chartMaker.chart.init(chartMaker.chartData);
  }
  console.log(chartMaker);
}
