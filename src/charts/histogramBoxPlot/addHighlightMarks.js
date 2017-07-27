export default function addHighlightMarks(chart) {
  //add highlights for each bar (if any exist)
  var bars = chart.svg.selectAll('g.bar-group').each(function(d) {
    var highlightCount = d3.sum(d.values.raw, function(d) {
      return d.highlighted ? 1 : 0;
    });
    //Clone the rect (if there are highlights)
    if (highlightCount > 0) {
      var rect = d3.select(this).select('rect');
      var rectNode = rect.node();
      var highlightRect = d3.select(this).append('rect');

      highlightRect
        .attr('x', chart.x(d.rangeLow) + 1)
        .attr('y', chart.y(highlightCount))
        .attr('height', chart.y(0) - chart.y(highlightCount))
        .attr('width', chart.x(d.rangeHigh) - 1 - (chart.x(d.rangeLow) + 1))
        .attr('fill', 'orange');
    }
  });
}
