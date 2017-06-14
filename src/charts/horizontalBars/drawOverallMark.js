import { format as d3format } from "d3";

export default function drawOverallMark(chart) {
  //Clear overall marks.
  chart.svg.selectAll(".overall-mark").remove();

  //For each mark draw an overall mark.
  chart.config.overall.forEach(d => {
    if (chart.config.y.order.indexOf(d.key) > -1) {
      const g = chart.svg.append("g").classed("overall-mark", true);
      const x = d[chart.config.x.column];
      const y = d.key;
      console.log(x);

      //Draw vertical line representing the overall rate of the current categorical value.
      if (chart.y(y)) {
        const rateLine = g
          .append("line")
          .attr({
            x1: chart.x(x),
            y1: chart.y(y),
            x2: chart.x(x),
            y2: chart.y(y) + chart.y.rangeBand()
          })
          .style({
            stroke: "black",
            "stroke-width": "2px",
            "stroke-opacity": "1"
          });
        rateLine
          .append("title")
          .text(`Overall rate: ${d3format(chart.config.x.format)(x)}`);
      }
    }
  });
}
