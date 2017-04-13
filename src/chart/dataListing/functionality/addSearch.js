import addPagination from './addPagination';

export default function addSearch(dataListing) {
    dataListing.search = {};
    dataListing.search.wrap = dataListing.wrap
        .select('.search-container');
    dataListing.search.wrap
        .select('.search-box')
        .on('input', function() {
            const
                inputText = this.value.toLowerCase();

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
                        .classed('filtered', filtered);
                });

            addPagination(dataListing);
        });
}
