export default function makeLine(this_, d) {
  var height = 15,
    width = 100;

  var svg = d3
    .select(this_)
    .append('svg')
    .attr('height', height)
    .attr('width', width);

  // scales
  console.log(d);
  var values = d.values.map(function(m) {
    return +m.value;
  });

  var max = d3.max(values);
  var min = d3.min(values);
  var x = d3.scale
    .linear()
    .domain([min, max])
    .range([0, width]);

  // Generate a histogram using twenty uniformly-spaced bins.
  var data = d3.layout.histogram().bins(x.ticks(20))(values);

  var yMax = d3.max(data, function(d) {
    return d.length;
  });

  var yMin = d3.min(data, function(d) {
    return d.length;
  });

  var y = d3.scale
    .linear()
    .domain([0, yMax])
    .range([height - 1, 1]);

  var dist = svg
    .selectAll('.dist')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'dist')
    .attr('transform', function(d) {
      return 'translate(' + x(d.x) + ',' + y(d.y) + ')';
    });

  var draw_sparkline = d3.svg
    .line()
    .interpolate('cardinal')
    .x(d => x(d.x))
    .y(d => y(d.y));

  var sparkline = svg
    .append('path')
    .datum(data)
    .attr({
      class: 'sparkLine',
      d: draw_sparkline,
      fill: 'none',
      stroke: '#999'
    });
}
