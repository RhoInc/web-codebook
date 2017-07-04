import { select as d3select } from 'd3';

export default function highlightData(chart) {
    const
        codebook = d3select(chart.wrap.node().parentNode.parentNode.parentNode).datum(), // codebook object is attached to .summaryTable element
        bars = chart.svg.selectAll('.bar-group');

    bars.on('click', d => {
            d3.select(this).classed('active', true);
            const
                indexes = chart.config.chartType.indexOf('Bars') > -1
                    ? d.values.raw[0].indexes
                    : chart.config.chartType === 'histogramBoxPlot'
                        ? d.values.raw.map(di => di.index)
                        : [];
            codebook.data.highlighted = codebook.data.filtered
                .filter(di => {
                    return indexes.indexOf(di['web-codebook-index']) > -1;
                });

          //Display highlighted data in listing.
            codebook.dataListing.init(codebook);

          //Active data listing tab.
            codebook.nav.tabs.forEach(function(t) {
                t.active = t.label === 'Data Listing'; // set the clicked tab to active
                codebook.nav.wrap.selectAll('li').filter(f => f == t).classed('active', t.active); // style the active nav element
                t.wrap.classed('hidden', !t.active); // hide all of the wraps (except for the active one)
            });
        });
}
