import { init as initControls } from './columnSelect/init.js';

export function init(codebook) {
  const chartMaker = codebook.chartMaker;
  chartMaker.codebook = codebook;
  chartMaker.config = codebook.config;

  //layout
  chartMaker.wrap.selectAll('*').remove();
  chartMaker.controlsWrap = chartMaker.wrap
    .append('div')
    .attr('class', 'cm-controls');
  chartMaker.chartWrap = chartMaker.wrap
    .append('div')
    .attr('class', 'cm-chart');

  if (codebook.data.summary.length > 2) {
    initControls(codebook); //make controls
    chartMaker.draw(codebook); //draw the initial codebook
  } else {
    chartMaker.wrap
      .append('div')
      .attr('class', 'status')
      .text('Two or more variables required to use Charts module.');
  }
}
