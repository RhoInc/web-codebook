export default function makeHist(this_, d) {
  var height = 15,
    width = 100;

  var svg = d3
    .select(this_)
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .style('margin-right', '0.1em');

  if (d.type == 'categorical') {
    var bins = d.statistics.values;
    bins.forEach(function(d) {
      d.title = d.key + ' - ' + d.n + ' (' + d.prop_n_text + ')';
      d.color = '#999';
    });
  } else if (d.type == 'continuous') {
    var values = d.values.map(function(m) {
      return +m.value;
    });
    var x_linear = d3.scale
      .linear()
      .domain(d3.extent(values))
      .range([0, width]);
    var bins = d3.layout
      .histogram()
      .bins(x_linear.ticks(50))(values)
      .map(function(m, i) {
        m.key = '[' + m.x + '-' + (m.x + m.dx) + ')';
        m.n = m.length;
        m.title = m.key + ' - ' + m.n;
        m.color = 'black';
        return m;
      });
  }

  // scales
  var x = d3.scale
    .ordinal()
    .domain(
      bins.map(function(d) {
        return d.key;
      })
    )
    .rangeBands([0, width], 0.1, 0);

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
    .attr('fill', d.type == 'categorical' ? '#999' : 'black')
    .append('title')
    .text(function(d) {
      return d.title;
    });
}
