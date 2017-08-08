import { charts } from '../../../charts';
import { select as d3select } from 'd3';

export default function makeChart(d) {
  //Common chart settings
  this.height = 100;
  this.margin = { right: 200, left: 30 };

  if (d.chartType === 'horizontalBars') {
    charts.createHorizontalBarsControls(this, d);
    charts.createHorizontalBars(this, d);
  } else if (d.chartType === 'verticalBars') {
    charts.createVerticalBarsControls(this, d);
    charts.createVerticalBars(this, d);
  } else if (d.chartType === 'histogramBoxPlot') {
    d3select(this).append('div').classed('row-controls', true);
    charts.createHistogramBoxPlot(this, d);
  } else {
    console.warn('Invalid chart type for ' + d.key);
  }
}
