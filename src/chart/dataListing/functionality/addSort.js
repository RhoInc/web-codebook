import sort from './addSort/sort';

export default function addSort(dataListing) {
    dataListing.table.wrap.selectAll('.headers th')
        .on('click', function() {
            const variable = this.textContent;
            let sortItem = dataListing.sort.order
                .filter(item => item.variable === variable)[0];

            if (!sortItem) {
                    sortItem =
                    {variable: variable
                    ,direction: 'ascending'
                    ,container: dataListing.sort.wrap
                        .append('div')
                        .datum({key: variable})
                        .classed('sort-box', true)
                        .text(variable)};
                sortItem.container
                    .append('span')
                    .classed('sort-direction', true)
                    .html('&darr;');
                sortItem.container
                    .append('span')
                    .classed('remove-sort', true)
                    .html('&#10060;');
                dataListing.sort.order.push(sortItem);
            } else {
                sortItem.direction = sortItem.direction === 'ascending'
                    ? 'descending'
                    : 'ascending';
                sortItem.container
                    .select('span.sort-direction')
                    .html(sortItem.direction === 'ascending'
                        ? '&darr;'
                        : '&uarr;');
            }

            sort(dataListing);
            dataListing.sort.wrap.select('.description')
                .classed('hidden', true);

          //Add sort container deletion functionality.
            dataListing.sort.order
                .forEach((item,i) => {
                    item.container
                        .on('click', function(d) {
                            d3.select(this).remove();
                            dataListing.sort.order
                                .splice(dataListing.sort.order
                                    .map(d => d.variable)
                                        .indexOf(d.key), 1);

                            if (dataListing.sort.order.length)
                                sort(dataListing);
                            else
                                dataListing.sort.wrap.select('.description')
                                    .classed('hidden', false);
                        });
                });

        });
}
