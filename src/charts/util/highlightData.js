import { select as d3select } from 'd3';

export default function highlightData(chart) {
  const codebook = d3select(
    chart.wrap.node().parentNode.parentNode.parentNode
  ).datum(), // codebook object is attached to .summaryTable element
    bars = chart.svg.selectAll('.bar-group');

  bars.on('click', function(d) {
    codebook.wrap.selectAll('.bar-group').classed('highlighted', false);
    d3select(this).classed('highlighted', true);

    const indexes = chart.config.chartType.indexOf('Bars') > -1
      ? d.values.raw[0].indexes
      : chart.config.chartType === 'histogramBoxPlot'
        ? d.values.raw.map(di => di.index)
        : [];

    codebook.data.highlighted = codebook.data.filtered.filter(di => {
      return indexes.indexOf(di['web-codebook-index']) > -1;
    });

    //Display highlighted data in listing & codebook.
    codebook.data.makeSummary(codebook);
    codebook.dataListing.init(codebook);
    codebook.summaryTable.draw(codebook);
    codebook.controls.updateRowCount(codebook);
  });
}
