import { charts } from "../../../charts";

export default function makeChart(d) {
  //Common chart settings
  this.height = 100;
  this.margin = { right: 200, left: 30 };

  if (d.chartType === "barChart") {
    charts.createHorizontalBarsControls(this, d);
    charts.createHorizontalBars(this, d);
  } else if (d.chartType === "levelChart") {
    charts.createVerticalBarsControls(this, d);
    charts.createVerticalBars(this, d);
  } else if (d.chartType === "histogram") {
    // continuous outcomes
    charts.createHistogramBoxPlot(this, d);
  } else {
    console.warn("Invalid chart type for " + d.key);
  }
}
