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

    //Hide data listing columns corresponding to variables specified in settings.hiddenVariables.
    this.table
      .selectAll("th,td")
      .classed(
        "hidden",
        d => dataListing.config.hiddenVariables.indexOf(d.col ? d.col : d) > -1
      );
  });
}
