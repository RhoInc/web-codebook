import clone from "../util/clone";
import onInit from "./horizontalBars/onInit";
import onResize from "./horizontalBars/onResize";
import { createChart } from "webcharts";
import { select as d3select, max as d3max } from "d3";

export function createHorizontalBars(this_, d) {
  //hide the controls if the chart isn't Grouped
  const rowSelector = d3select(this_).node().parentNode;
  const chartControls = d3select(rowSelector)
    .select(".row-controls")
    .classed("hidden", !d.groups);

  //let height vary based on the number of levels
  const custom_height = d.statistics.values.length * 20 + 35; //35 ~= top and bottom margin

  //Chart settings
  const chartContainer = d3select(this_).node();
  const chartSettings = {
    x: {
      column: "prop_n",
      type: "linear",
      label: "",
      format: "%",
      domain: [0, null]
    },
    y: {
      column: "key",
      type: "ordinal",
      label: ""
    },
    marks: [
      {
        type: "bar",
        per: ["key"],
        summarizeX: "mean",
        tooltip: "[key]: [n] ([prop_n_text])",
        attributes: {
          stroke: null
        }
      }
    ],
    colors: ["#999", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99"],
    gridlines: "xy",
    resizable: false,
    height: custom_height,
    margin: this_.margin,
    value_col: d.value_col,
    group_col: d.group || null,
    overall: d.statistics.values
  };

  //Sort data by descending rate and keep only the first five categories.
  const chartData = d.statistics.values.sort(
    (a, b) =>
      a.prop_n > b.prop_n
        ? -2
        : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1
  );

  chartSettings.y.order = chartData.map(d => d.key).reverse();

  if (d.groups) {
    //Set upper limit of x-axis domain to the maximum group rate.
    chartSettings.x.domain[1] = d3max(d.groups, di =>
      d3max(di.statistics.values, dii => dii.prop_n)
    );

    d.groups.forEach(group => {
      //Define group-level settings.
      group.chartSettings = clone(chartSettings);
      group.chartSettings.group_val = group.group;
      group.chartSettings.n = group.values.length;

      //Sort data by descending rate and keep only the first five categories.
      group.data = group.statistics.values
        .filter(di => chartSettings.y.order.indexOf(di.key) > -1)
        .sort(
          (a, b) =>
            a.prop_n > b.prop_n
              ? -2
              : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1
        );

      //Define chart.
      group.chart = createChart(chartContainer, group.chartSettings);
      group.chart.on("init", onInit);
      group.chart.on("resize", onResize);

      if (group.data.length) group.chart.init(group.data);
      else {
        d3select(chartContainer)
          .append("p")
          .text(
            `${chartSettings.group_col}: ${group.chartSettings
              .group_val} (n=${group.chartSettings.n})`
          );
        d3select(chartContainer)
          .append("div")
          .html(
            `<em>This group does not contain any of the first 5 most prevalent levels of ${d.value_col}</em>.<br><br>`
          );
      }
    });
  } else {
    //Define chart.
    const chart = createChart(chartContainer, chartSettings);
    chart.on("init", onInit);
    chart.on("resize", onResize);
    chart.init(chartData);
  }
}
