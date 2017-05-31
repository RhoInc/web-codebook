import clone from "../util/clone";
import onResize from "./dotPlot/onResize";
import { createChart } from "webcharts";
import { select as d3select } from "d3";

export function createDotPlot(this_, d) {
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
        type: "circle",
        per: ["key"],
        summarizeX: "mean",
        tooltip: "[key]: [n] ([prop_n_text])"
      }
    ],
    gridlines: "xy",
    resizable: false,
    height: this_.height,
    margin: this_.margin,
    value_col: d.value_col,
    group_col: d.group || null,
    overall: d.statistics.values
  };

  //Sort data by descending rate and keep only the first five categories.
  const chartData = d.statistics.values
    .sort(
      (a, b) =>
        a.prop_n > b.prop_n
          ? -2
          : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1
    )
    .slice(0, 5);
  chartSettings.y.order = chartData.map(d => d.key).reverse();

  if (d.groups) {
    //Define overall data.
    chartData.forEach(di => (di.group = "Overall"));

    //Add group data to overall data.
    d.groups.forEach(group => {
      group.statistics.values
        .filter(value => chartSettings.y.order.indexOf(value.key) > -1)
        .sort(
          (a, b) =>
            a.prop_n > b.prop_n
              ? -2
              : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1
        )
        .forEach(value => {
          value.group = group.group;
          chartData.push(value);
        });
    });

    //Overall mark
    chartSettings.marks[0].per.push("group");
    chartSettings.marks[0].values = { group: ["Overall"] };

    //Group marks
    chartSettings.marks[1] = clone(chartSettings.marks[0]);
    chartSettings.marks[1].values = { group: d.groups.map(d => d.group) };

    chartSettings.color_by = "group";
    chartSettings.legend = {
      label: "",
      order: d.groups.map(d => d.group),
      mark: "circle"
    };
  }

  const chart = createChart(chartContainer, chartSettings);
  chart.on("resize", onResize);
  chart.init(chartData);
}
