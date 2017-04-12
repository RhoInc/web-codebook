import layout from './layout';
import { createTable } from 'webcharts';
import onDraw from './onDraw';

export function init(codebook) {
    const
        dataListing = codebook.dataListing;
        layout(dataListing);

  //Define table.
    dataListing.table = createTable('.web-codebook .dataListing .listing-container', {});

  //Define callback.
    onDraw(dataListing);

  //Initialize table.
    dataListing.table.init(codebook.data.filtered);
}
