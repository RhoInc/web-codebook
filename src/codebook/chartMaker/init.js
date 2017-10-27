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

  //make controls
  initControls(codebook);

  //draw the initial codebook
  chartMaker.draw(codebook);
}
