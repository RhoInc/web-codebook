/*------------------------------------------------------------------------------------------------\
  Intialize the summary table
\------------------------------------------------------------------------------------------------*/

import makeChart from './renderRow/makeChart.js';
import makeDetails from './renderRow/makeDetails.js';
import makeMeta from './renderRow/makeMeta.js';
import makeTitle from './renderRow/makeTitle.js';

import { select as d3select } from 'd3';

export function renderRow(d) {
    var rowWrap = d3select(this);
    rowWrap.selectAll('*').remove();

    rowWrap
        .append('div')
        .attr('class', 'row-head section')
        .append('div')
        .attr('class', 'row-title')
        .each(makeTitle);

    rowWrap
        .append('div')
        .attr('class', 'row-details section')
        .each(makeDetails);

    rowWrap
        .append('div')
        .attr('class', 'row-chart section')
        .each(makeChart);

    rowWrap
        .append('div')
        .attr('class', 'row-meta section')
        .each(makeMeta);
}
