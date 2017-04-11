export default function addSortFunctionality(dataListing) {
    dataListing.sort = {};
    dataListing.sort.wrap = dataListing.wrap
        .append('div')
        .attr('id', 'sort-container');
    dataListing.sort.wrap
        .append('span')
        .classed('sort-description', true)
        .style('font-style', 'italic')
        .html(
            'Click any column header to sort that column.<br>' + 
            'Click additional column headers to further arrange the data.<br>' +
            'Click a column a second time to reverse its sort order.');
    dataListing.sort.order = [];
}
