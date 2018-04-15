export default function makeHist(this_, d) {
  var height = 15,
    width = 100;

  var svg = d3
    .select(this_)
    .append('svg')
    .attr('height', height)
    .attr('width', width);

  // scales
  var bins = d.statistics.values;
  var x = d3.scale
    .ordinal()
    .domain(
      bins.map(function(d) {
        return d.key;
      })
    )
    .rangeBands([0, width], 0.1);
  var width = x.rangeBand();

  var y = d3.scale
    .linear()
    .domain([
      0,
      d3.max(bins, function(d) {
        return d.n;
      })
    ])
    .range([height, 0]);

  var bar = svg
    .selectAll('.bar')
    .data(bins)
    .enter()
    .append('g')
    .attr('class', 'bar')
    .attr('transform', function(d) {
      return 'translate(' + x(d.key) + ',' + y(d.n) + ')';
    });

  bar
    .append('rect')
    .attr('x', 1)
    .attr('width', width)
    .attr('height', function(d) {
      return height - y(d.n);
    })
    .attr('fill', '#999')
    .append('title')
    .text(function(d) {
      return d.key + ' - ' + d.n + ' (' + d.prop_n_text + ')';
    });
}
