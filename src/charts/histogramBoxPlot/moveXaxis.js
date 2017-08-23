export default function moveXaxis(chart) {
  var xticks = chart.svg.select('.x.axis').selectAll('g.tick');
  xticks.select('text').remove();
  xticks
    .append('text')
    .attr('y', chart.config.boxPlotHeight)
    .attr('dy', '1em')
    .attr('x', 0)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'top')
    .text(d => d);
}
