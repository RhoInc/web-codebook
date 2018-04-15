export default function makeLine(this_, d) {
  var height = 15,
    width = 100;

  var svg = d3
    .select(this_)
    .append('svg')
    .attr('height', height)
    .attr('width', width);

  //get values
  var values = d.values.map(function(m) {
    return +m.value;
  });
  var max = d3.max(values);
  var min = d3.min(values);

  // scales
  var x_all = d3.scale
    .linear()
    .domain([min, max])
    .range([0, width]);

  // Generate a histogram using  uniformly-spaced bins.
  console.log(d);
  var data = d3.layout.histogram().bins(x_all.ticks(d.bins))(values);

  //calculate 2nd x scale so that distribution covers the whole svg
  var x = d3.scale
    .linear()
    .domain(
      d3.extent(data, function(d) {
        return d.x;
      })
    )
    .range([0, width]);

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
  var title = svg
    .append('title')
    .text(
      'Mean (SD): ' +
        d.statistics.mean +
        ' (' +
        d.statistics.SD +
        ')' +
        '\nRange: ' +
        d.statistics.min +
        '-' +
        d.statistics.max
    );
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
