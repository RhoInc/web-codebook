/*------------------------------------------------------------------------------------------------\
  Intialize the summary table
\------------------------------------------------------------------------------------------------*/

import makeChart from './renderRow/makeChart.js';
import makeDetails from './renderRow/makeDetails.js';
import makeTitle from './renderRow/makeTitle.js';

import { select as d3select } from 'd3';

export function renderRow(d) {
  var rowWrap = d3select(this);
  rowWrap.selectAll('*').remove();

  var rowHead = rowWrap.append('div').attr('class', 'row-head section');

  rowHead
    .append('div')
    .attr('class', 'row-title')
    .each(makeTitle);
  //rowHead.append('div').attr('class', 'row-values').each(makeValues);

  rowWrap
    .append('div')
    .attr('class', 'row-chart section')
    .each(makeChart);

  rowHead
    .append('div')
    .attr('class', 'row-details')
    .each(makeDetails);
}
