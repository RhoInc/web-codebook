import { createVerticalBars } from "./createVerticalBars.js";
import { select as d3select } from "d3";

export function createVerticalBarsControls(this_, d) {
  const controlsContainer = d3select(this_)
    .append("div")
    .classed("row-controls", true);

  //add control that changes x-axis order
  var sort_values = ["Alphabetical", "Ascending", "Descending"];
  var sortWrap = controlsContainer.append("div").classed("x-axis-sort", true);
  sortWrap.append("small").text("Sort levels: ");
  var x_sort = sortWrap.append("select");
  x_sort
    .selectAll("option")
    .data(sort_values)
    .enter()
    .append("option")
    .text(d => d);

  x_sort.on("change", function() {
    d3select(this_).selectAll(".wc-chart").remove();
    d3select(this_).selectAll(".panel-label").remove();
    createVerticalBars(this_, d);
  });

  //add control that changes y-axis scale
  var outcomes = ["rate", "frequency"];
  var outcomeWrap = controlsContainer
    .append("div")
    .classed("y-axis-outcome", true);
  outcomeWrap.append("small").text("Summarize by: ");
  var outcomeSelect = outcomeWrap.append("select");
  outcomeSelect
    .selectAll("option")
    .data(outcomes)
    .enter()
    .append("option")
    .text(d => d);

  outcomeSelect.on("change", function() {
    d3select(this_).selectAll(".wc-chart").remove();
    d3select(this_).selectAll(".panel-label").remove();
    createVerticalBars(this_, d);
  });
}
