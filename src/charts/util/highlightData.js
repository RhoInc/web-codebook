import { select as d3select } from 'd3';
import indicateLoading from '../../codebook/util/indicateLoading';

export default function highlightData(chart) {
  const codebook = d3select(
      chart.wrap.node().parentNode.parentNode.parentNode
    ).datum(), // codebook object is attached to .summaryTable element
    bars = chart.svg.selectAll('.bar-group');

  bars.on('click', function(d) {
    indicateLoading(codebook, '.highlightCount', () => {
      const newIndexes =
        chart.config.chartType.indexOf('Bars') > -1
          ? d.values.raw[0].indexes
          : chart.config.chartType === 'histogramBoxPlot'
            ? d.values.raw.map(di => di.index)
            : [];
      const currentIndexes = codebook.data.highlighted.map(
        di => di['web-codebook-index']
      );
      const removeIndexes = currentIndexes.filter(
        di => newIndexes.indexOf(di) > -1
      );

      codebook.data.highlighted = codebook.data.filtered.filter(di => {
        return removeIndexes.length
          ? currentIndexes.indexOf(di['web-codebook-index']) > -1 &&
              removeIndexes.indexOf(di['web-codebook-index']) === -1
          : currentIndexes.indexOf(di['web-codebook-index']) > -1 ||
              newIndexes.indexOf(di['web-codebook-index']) > -1;
      });

      //Display highlighted data in listing & codebook.
      codebook.data.makeSummary(codebook);
      codebook.dataListing.init(codebook);
      codebook.summaryTable.draw(codebook);
      codebook.chartMaker.draw(codebook);
      codebook.title.updateCountSummary(codebook);
    });
  });
}
