/*------------------------------------------------------------------------------------------------\
  Intialize the summary table
\------------------------------------------------------------------------------------------------*/

import makeTitle from "./renderRow/makeTitle.js";
import makeChart from "./renderRow/makeChart.js";
import makeDetails from "./renderRow/makeDetails.js";
import { select as d3select } from "d3";

export function renderRow(d) {
  var rowWrap = d3select(this);
  rowWrap.selectAll("*").remove();

  var rowHead = rowWrap.append("div").attr("class", "row-head section");

  rowHead
    .append("div")
    .attr("class", "row-toggle")
    .html("&#9658;")
    .on("click", function() {
      var rowDiv = d3select(this.parentNode.parentNode);
      var chartDiv = rowDiv.select(".row-chart");
      var hiddenFlag = rowDiv.classed("hiddenChart");
      rowDiv.classed("hiddenChart", !hiddenFlag);
      d3select(this).html(hiddenFlag ? "&#9660;" : "&#9658;");
    });

  rowHead.append("div").attr("class", "row-title").each(makeTitle);
  rowHead.append("div").attr("class", "row-details").each(makeDetails);
  rowWrap.append("div").attr("class", "row-chart section").each(makeChart);
}
