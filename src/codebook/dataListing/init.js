import layout from './layout';
import onDraw from './onDraw';
import { createTable } from 'webcharts';
import indicateLoading from '../util/indicateLoading';

export function init(codebook) {
  indicateLoading(codebook, () => {

    const dataListing = codebook.dataListing;
    dataListing.codebook = codebook;
    dataListing.config = codebook.config;
    layout(dataListing);
    //sort config
    dataListing.sort = {};
    dataListing.sort.wrap = dataListing.wrap.select('.sort-container');
    dataListing.sort.order = [];
    //pagination config
    dataListing.pagination = {};
    dataListing.pagination.wrap = dataListing.wrap.select(
        '.pagination-container'
    );
    dataListing.pagination.rowsShown = 25;
    dataListing.pagination.activeLink = 0;

    //Define table.
    dataListing.table = createTable(
        '.web-codebook .dataListing .listing-container',
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
    var sub = dataListing.sorted_raw_data.filter(function(d, i) {
        return i < 25;
    });
    dataListing.table.init(sub);
  });
}
