/*------------------------------------------------------------------------------------------------\
intialize the summary table
\------------------------------------------------------------------------------------------------*/
import { rowDetails } from './rowDetails';

export function renderRow(d) {
  var rowWrap = d3.select(this)
  rowWrap.append("div").attr("class","row-overview section")
  rowWrap.append("div").attr("class","row-details section").each(rowDetails)
}
