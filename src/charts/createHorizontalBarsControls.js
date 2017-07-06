import { createHorizontalBars } from './createHorizontalBars.js';
import { createDotPlot } from './createDotPlot.js';
import { select as d3select } from 'd3';

export function createHorizontalBarsControls(this_, d) {
  const controlsContainer = d3select(this_)
    .append('div')
    .classed('row-controls', true);

  //add control that changes y-axis scale
  var outcomes = ['rate', 'frequency'];
  var outcomeWrap = controlsContainer
    .append('div')
    .classed('x-axis-outcome', true);
  outcomeWrap.append('small').text('Summarize by: ');
  var outcomeSelect = outcomeWrap.append('select');
  outcomeSelect
    .selectAll('option')
    .data(outcomes)
    .enter()
    .append('option')
    .text(d => d);

  outcomeSelect.on('change', function() {
    d3select(this_).selectAll('.wc-chart').remove();
    d3select(this_).selectAll('.panel-label').remove();
    if (type_control.property('value') === 'Paneled (Bar Charts)') {
      createHorizontalBars(this_, d);
    } else {
      createDotPlot(this_, d);
    }
  });

  //add control that change chart type
  var chart_type_values = ['Paneled (Bar Charts)', 'Grouped (Dot Plot)'];
  var chartTypeWrap = controlsContainer
    .append('div')
    .classed('chart-type', true)
    .classed('hidden', !d.groups); // hide the controls if the chart isn't Grouped
  chartTypeWrap.append('small').text('Display Type: ');
  var type_control = chartTypeWrap.append('select');
  type_control
    .selectAll('option')
    .data(chart_type_values)
    .enter()
    .append('option')
    .text(d => d);

  type_control.on('change', function() {
    d3select(this_).selectAll('.wc-chart').remove();
    d3select(this_).selectAll('.panel-label').remove();
    if (this.value == 'Paneled (Bar Charts)') {
      createHorizontalBars(this_, d);
    } else {
      createDotPlot(this_, d);
    }
  });
}
