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
    var sub = dataListing.sorted_raw_data
    .filter(function(d,i){
      return i >=  dataListing.pagination.startItem & i < dataListing.pagination.endItem;
    })
    dataListing.table.draw(sub)
}
