import addSort from "./functionality/addSort";
import addSearch from "./functionality/addSearch";
import addPagination from "./functionality/addPagination";

export default function onDraw(dataListing) {
  dataListing.table.on("draw", function() {
    //Add header sort functionality.
    addSort(dataListing);

    //Add text search functionality.
    addSearch(dataListing);

    //Add pagination functionality.
    addPagination(dataListing);
  });
}
