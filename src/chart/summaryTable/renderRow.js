import makeHeader from './renderRow/makeHeader.js';
import makeChart from './renderRow/makeChart.js';
import makeDetails from './renderRow/makeDetails.js';

/*------------------------------------------------------------------------------------------------\
  Intialize the summary table
\------------------------------------------------------------------------------------------------*/

export function renderRow(d) {
    var rowWrap = d3.select(this);
    rowWrap.selectAll('*').remove();

    rowWrap.append('div').attr('class','row-header section').each(makeHeader);
    rowWrap.append('div').attr('class','row-chart section').each(makeChart);
    rowWrap.append('div').attr('class','row-details section').each(makeDetails);
}
