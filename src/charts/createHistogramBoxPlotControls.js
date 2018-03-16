import { createHistogramBoxPlot } from './createHistogramBoxPlot.js';
import { select as d3select } from 'd3';

export function createHistogramBoxPlotControls(this_, d) {
  const controlsContainer = d3select(this_)
    .append('div')
    .classed('row-controls', true);

  //add control for commonScale control (only if data is grouped)
  if (d.group) {
    var commonScaleWrap = controlsContainer
      .append('div')
      .classed('common-scale-control', true);
    commonScaleWrap.append('small').text('Standardize axes across panels? ');
    var commonScaleCheckbox = commonScaleWrap
      .append('input')
      .attr('type', 'checkbox')
      .attr('checked', true);

    commonScaleCheckbox.on('change', function() {
      d3select(this_)
        .selectAll('.wc-chart')
        .remove();
      d3select(this_)
        .selectAll('.panel-label')
        .remove();
      d.commonScale = this.checked;
      createHistogramBoxPlot(this_, d);
    });
  }
}
