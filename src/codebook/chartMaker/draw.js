import { createChart } from 'webcharts';
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

  //Define chart.
  chartMaker.chart = createChart(
    '.web-codebook .chartMaker.section .cm-chart',
    chartMaker.chartSettings
  );

  chartMaker.chart.init(chartMaker.chartData);
}
