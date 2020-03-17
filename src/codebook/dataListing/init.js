import onDraw from './onDraw';
import { createTable } from 'webcharts';
import indicateLoading from '../util/indicateLoading';

export function init(codebook) {
    //indicateLoading(codebook, 'Listing initialization');

    const dataListing = codebook.dataListing;
    dataListing.codebook = codebook;
    dataListing.config = codebook.config;
    dataListing.wrap.selectAll('*').remove();

    //Define table.
    dataListing.table = createTable(
        codebook.wrap.select('.dataListing').node(),
        {}
    );

    //Define callback.
    onDraw(dataListing);

    //Initialize table.
    dataListing.super_raw_data = codebook.data.filtered;
    dataListing.sorted_raw_data = codebook.data.filtered.sort(function(a, b) {
        var a_highlight = codebook.data.highlighted.indexOf(a) > -1;
        var b_highlight = codebook.data.highlighted.indexOf(b) > -1;
        if (a_highlight == b_highlight) {
            return 0;
        } else if (a_highlight) {
            return -1;
        } else if (b_highlight) {
            return 1;
        }
    });

    dataListing.table.init(dataListing.sorted_raw_data);
}
