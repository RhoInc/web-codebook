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
    dataListing.codebook = codebook
    var sub = codebook.data.filtered
    .filter(function(d,i){
      return  i<25
    })
    console.log(sub.length)
    dataListing.table.init(sub);
}
