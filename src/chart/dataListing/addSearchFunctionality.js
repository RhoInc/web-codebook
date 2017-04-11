export default function addSearchFunctionality(dataListing) {
    dataListing.search = {};
    dataListing.search.wrap = dataListing.wrap
        .append('div')
        .attr('id', 'search-container');
    dataListing.search.wrap
        .append('input')
        .classed('search-box', true)
        .attr(
            {'type': 'search'})
        .on('input', function() {
            const inputText = this.value.toLowerCase();

          //Determine which rows contain input text.
            dataListing.table.wrap.selectAll('tbody tr')
                .each(function() {
                    let filtered = true;

                    d3.select(this).selectAll('td')
                        .each(function() {
                            if (filtered === true) {
                                const cellText = this.textContent.toLowerCase();
                                filtered = cellText.indexOf(inputText) === -1;
                            }
                        });

                    d3.select(this)
                        .style('display', filtered ? 'none' : 'table-row');
                });
        });
}
