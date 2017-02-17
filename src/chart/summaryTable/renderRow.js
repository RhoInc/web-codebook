import makeOverview from './renderRow/makeOverview.js';

/*------------------------------------------------------------------------------------------------\
intialize the summary table
\------------------------------------------------------------------------------------------------*/

export function renderRow(d) {
  var rowWrap = d3.select(this)
  rowWrap.append("div").attr("class","row-overview").call(makeOverview)
  //rowWrap.append("div").attr("class","row-details").call(makeDetails)
}
