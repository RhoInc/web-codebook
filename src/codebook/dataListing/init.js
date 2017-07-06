import layout from './layout';
import onDraw from './onDraw';
import { createTable } from 'webcharts';

export function init(codebook) {
  const dataListing = codebook.dataListing;
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
  dataListing.sorted_raw_data = codebook.data.filtered;
  var sub = dataListing.sorted_raw_data.filter(function(d, i) {
    return i < 25;
  });
  dataListing.table.init(sub);
}
