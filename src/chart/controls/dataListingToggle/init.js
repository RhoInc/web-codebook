export function init(chart) {
    const container = chart.controls.wrap
        .append('div')
        .classed('data-listing-toggle', true)
        .text(chart.dataListing.wrap.style('display') === 'none'
            ? 'View data'
            : 'View codebook');
    container
        .on('click', function() {
            if (chart.dataListing.wrap.style('display') === 'none') {
                chart.dataListing.wrap
                    .classed('hidden', false);
                chart.summaryTable.wrap
                    .classed('hidden', true);
                container.text('View codebook');
            } else {
                chart.dataListing.wrap
                    .classed('hidden', true);
                chart.summaryTable.wrap
                    .classed('hidden', false);
                container.text('View data');
            }
        });
}
