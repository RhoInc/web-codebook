import { createHorizontalBars } from "./createHorizontalBars.js";
import { createDotPlot } from "./createDotPlot.js";
import { select as d3select } from "d3";

export function createHorizontalBarsControls(this_, d) {
  var chart_type_values = ["Paneled (Bar Charts)", "Grouped (Dot Plot)"];
  var wrap = d3select(this_).append("div").attr("class", "row-controls");
  wrap.append("small").text("Display Type: ");
  var type_control = wrap.append("select");
  type_control
    .selectAll("option")
    .data(chart_type_values)
    .enter()
    .append("option")
    .text(d => d);

  type_control.on("change", function() {
    d3select(this_).selectAll(".wc-chart").remove();
    d3select(this_).selectAll(".panel-label").remove();
    if (this.value == "Paneled (Bar Charts)") {
      createHorizontalBars(this_, d);
    } else {
      createDotPlot(this_, d);
    }
  });
}
