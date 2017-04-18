import updatePagination from '../addPagination/updatePagination';

export default function sort(dataListing) {
  dataListing.sorted_raw_data = dataListing.sorted_raw_data
      .sort(function(a,b) {
            let order = 0;

            dataListing.sort.order
                .forEach(item => {
                    const acell = a[item.variable];
                    const bcell = b[item.variable];

                    if (order === 0) {
                        if (
                            (item.direction ===  'ascending' && acell < bcell) ||
                            (item.direction === 'descending' && acell > bcell))
                                order = -1;
                        else if (
                            (item.direction ===  'ascending' && acell > bcell) ||
                            (item.direction === 'descending' && acell < bcell))
                                order = 1;
                    }
                });
            return order;
        });
    updatePagination(dataListing);
}
