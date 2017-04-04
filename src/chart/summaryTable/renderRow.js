import makeTitle from './renderRow/makeTitle.js';
import makeChart from './renderRow/makeChart.js';
import makeDetails from './renderRow/makeDetails.js';

/*------------------------------------------------------------------------------------------------\
  Intialize the summary table
\------------------------------------------------------------------------------------------------*/

export function renderRow(d) {
    var rowWrap = d3.select(this);
    rowWrap.selectAll('*').remove();

    var rowHead = rowWrap.append("div").attr("class","row-head section")
    rowHead.append('div').attr('class','row-title').each(makeTitle);
    rowHead.append('div').attr('class','row-details').each(makeDetails);

    rowWrap.append('div').attr('class','row-chart section').each(makeChart);
}
