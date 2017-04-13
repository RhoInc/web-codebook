export default function updatePagination(dataListing) {
  //Reset pagination.
    dataListing.pagination.links
        .classed('active', false);

  //Set to active the selected page link and unhide associated rows.
    dataListing.pagination.links
        .filter(link => +link.rel === +dataListing.pagination.activeLink)
        .classed('active', true);
    dataListing.pagination.startItem = dataListing.pagination.activeLink * dataListing.pagination.rowsShown;
    dataListing.pagination.endItem = dataListing.pagination.startItem + dataListing.pagination.rowsShown;
    console.log(dataListing.pagination.endItem)
    console.log(dataListing.pagination.startItem)
    var sub = dataListing.codebook.data.filtered
    .filter(function(d,i){
      return i >=  dataListing.pagination.startItem & i < dataListing.pagination.endItem;
    })
    console.log(sub.length)
    dataListing.table.draw(sub)
    /*
    dataListing.table.table.selectAll('tbody tr:not(.filtered)')
        .classed('hidden', false)
        .filter((d,i) =>
            i <  dataListing.pagination.startItem ||
            i >= dataListing.pagination.endItem)
        .classed('hidden', true);
    */
}
