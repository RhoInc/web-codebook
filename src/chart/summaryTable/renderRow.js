import { makeOverview } from './renderRow/makeOverview.js';
import { makeDetails } from './renderRow/makeDetails.js';

/*------------------------------------------------------------------------------------------------\
intialize the summary table
\------------------------------------------------------------------------------------------------*/

export function renderRow(d) {
  var rowWrap = d3.select(this)
  rowWrap.selectAll("*").remove()
  rowWrap.append("div").attr("class","row-overview section").each(makeOverview)
  rowWrap.append("div").attr("class","row-details section").each(makeDetails)
}
