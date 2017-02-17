/*------------------------------------------------------------------------------------------------\
intialize the summary table
\------------------------------------------------------------------------------------------------*/

export function renderRow(d) {
  var rowWrap = d3.select(this)
  rowWrap.append("div").attr("class","row-overview")
  rowWrap.append("div").attr("class","row-details")
}
