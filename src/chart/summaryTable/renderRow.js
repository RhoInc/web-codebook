/*------------------------------------------------------------------------------------------------\
intialize the summary table
\------------------------------------------------------------------------------------------------*/

export function renderRow(d) {
  var rowWrap = d3.select(this)
  rowWrap.append("div").classed("row-overview")
  rowWrap.append("div").classed("row-details")
}
