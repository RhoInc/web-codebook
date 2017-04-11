import sort from './sort';

export default function onDraw(dataListing) {
    dataListing.table.on('draw', function() {
        const context = this;

    //Add header sort functionality.
        dataListing.table.wrap
            .selectAll('.headers th')
            .style('cursor', 'pointer')
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
                            .classed('sort', true)
                            .style(
                                {'display': 'inline-block'
                                ,'cursor': 'pointer'
                                ,'border': '2px solid #008CBA'
                                ,'border-radius': '4px'
                                ,'padding': '2px'
                                ,'margin-left': '3px'})
                            .text(variable)};
                    sortItem.container
                        .append('span')
                        .classed('sort-direction', true)
                        .html('&darr;');
                    sortItem.container
                        .append('span')
                        .classed('remove-sort', true)
                        .style(
                            {'float': 'right'
                            ,'border': '1px solid gray'
                            ,'padding': '1px 2px 1px 2px'
                            ,'font-size': '25%'})
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

                sort(context.table.selectAll('tbody tr'), dataListing.sort.order);
                dataListing.sort.wrap.select('.sort-description')
                    .html('Sorted by:');

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
                                    sort(context.table.selectAll('tbody tr'), dataListing.sort.order);
                                else
                                    dataListing.sort.wrap.select('.sort-description')
                                        .html(
                                            'Click any column header to sort that column.<br>' + 
                                            'Click additional column headers to further arrange the data.<br>' +
                                            'Click a column a second time to reverse its sort order.<br>');
                            });
                    });
            });
    });
}
