import { createVerticalBars } from './createVerticalBars.js';
import { select as d3select } from 'd3';

export function createVerticalBarsControls(this_, d) {
  var sort_values = ['Alphabetical', 'Ascending', 'Descending'];
  var wrap = d3select(this_).append('div').attr('class', 'row-controls');
  wrap.append('small').text('Sort levels: ');
  var x_sort = wrap.append('select');
  x_sort
    .selectAll('option')
    .data(sort_values)
    .enter()
    .append('option')
    .text(d => d);

  x_sort.on('change', function() {
    d3select(this_).selectAll('.wc-chart').remove();
    d3select(this_).selectAll('.panel-label').remove();
    createVerticalBars(this_, d);
  });
}
