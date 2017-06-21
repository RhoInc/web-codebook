import addSort from "./functionality/addSort";
import addSearch from "./functionality/addSearch";
import addPagination from "./functionality/addPagination";

export default function onDraw(dataListing) {
  dataListing.table.on("draw", function() {
    //Attach variable name rather than variable label to header to be able to apply settings.hiddenVariables to column headers.
    this.table.selectAll("th").each(function(d) {
      d3
        .select(this)
        .datum(
          dataListing.table.config.cols[
            dataListing.table.config.headers.indexOf(d)
          ]
        );
    });

    //Add header sort functionality.
    addSort(dataListing);

    //Add text search functionality.
    addSearch(dataListing);

    //Add pagination functionality.
    addPagination(dataListing);
  });
}
