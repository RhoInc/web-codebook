import { createTable } from 'webcharts';
import clone from '../../util/clone';
import addSortFunctionality from './addSortFunctionality';
import addSearchFunctionality from './addSearchFunctionality';
import onDraw from './onDraw';

export function draw(codebook) {
    const
        dataListing = codebook.dataListing;
        dataListing.wrap.selectAll('*').remove();

  //Add sort functionality.
    addSortFunctionality(dataListing);

  //Add search functionality.
    addSearchFunctionality(dataListing);

  //Define table.
    dataListing.table = createTable(codebook.dataListing.wrap.node(), {});

  //Define callbacks.
    onDraw(dataListing);

  //Initialize table.
    dataListing.table.init(codebook.data.filtered);
}
