import { charts } from '../../../charts';

export default function makeChart(d) {
  //Common chart settings
  this.height = 100;
  this.margin = { right: 200, left: 30 };
  if (d.statistics.n > 0) {
    if (d.chartType === 'horizontalBars') {
      charts.createHorizontalBarsControls(this, d);
      charts.createHorizontalBars(this, d);
    } else if (d.chartType === 'verticalBars') {
      charts.createVerticalBarsControls(this, d);
      charts.createVerticalBars(this, d);
    } else if (d.chartType === 'histogramBoxPlot') {
      // continuous outcomes
      charts.createHistogramBoxPlot(this, d);
    } else {
      console.warn('Invalid chart type for ' + d.key);
    }
  } else {
    d3
      .select(this)
      .append('div')
      .attr('class', 'missingText')
      .text('All values missing.');
  }
}
