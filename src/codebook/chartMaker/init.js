import { createChart } from 'webcharts';
import indicateLoading from '../util/indicateLoading';
import chartMakerSettings from './chartMakerSettings.js';
export function init(codebook) {
  indicateLoading(codebook, '.web-codebook .chartMaker');

  console.log(codebook);

  const chartMaker = codebook.chartMaker;
  chartMaker.codebook = codebook;
  chartMaker.config = codebook.config;
  chartMaker.wrap.append('h1').text('this is a chart maker!');

  /*
  //Define table.
  chartMaker.chart = createChart(
    '.web-codebook .chartMaker',
    chartMakerSettings
  );

  dataListing.table.init(codebook.data.filtered);
*/
}
