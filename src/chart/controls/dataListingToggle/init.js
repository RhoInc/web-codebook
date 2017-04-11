export function init(chart) {
    const container = chart.controls.wrap
        .append('div')
        .classed('data-listing-toggle', true)
        .style(
            {'display': 'inline-block'
            ,'width': '125px'
            ,'cursor': 'pointer'
            ,'border': '2px solid #008CBA'
            ,'text-align': 'center'
            ,'border-radius': '4px'
            ,'padding': '4px'
            ,'margin-right': '1em'})
        .text(chart.dataListing.wrap.style('display') === 'none'
            ? 'View data'
            : 'View codebook');
    container
        .on('click', function() {
            if (chart.dataListing.wrap.style('display') === 'none') {
                chart.dataListing.wrap
                    .style('display', 'block');
                chart.summaryTable.wrap
                    .style('display', 'none');
                container.text('View codebook');
            } else {
                chart.dataListing.wrap
                    .style('display', 'none');
                chart.summaryTable.wrap
                    .style('display', 'block');
                container.text('View data');
            }
        });
}
