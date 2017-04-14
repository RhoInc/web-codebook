import updatePagination from "./addPagination/updatePagination";

export default function addSearch(dataListing) {
  dataListing.search = {};
  dataListing.search.wrap = dataListing.wrap.select(".search-container");
  dataListing.search.wrap.select(".search-box").on("input", function() {
    const inputText = this.value.toLowerCase();
    //Determine which rows contain input text.
    dataListing.sorted_raw_data = dataListing.super_raw_data.filter(function(
      d
    ) {
      let match = false;
      let vars = Object.keys(d);
      vars.forEach(function(var_name) {
        if (match === false) {
          const cellText = "" + d[var_name];
          match = cellText.toLowerCase().indexOf(inputText) > -1;
        }
      });
      return match;
    });
    //render the chart
    var sub = dataListing.sorted_raw_data.filter(function(d, i) {
      return i < 25;
    });
    //discard the sort
    dataListing.sort.order.forEach(function(item) {
      item.container.remove();
    });
    dataListing.sort.order = [];
    dataListing.sort.wrap.select(".description").classed("hidden", false);

    //reset to first page
    dataListing.pagination.activeLink = 0;
    updatePagination(dataListing);
  });
}
