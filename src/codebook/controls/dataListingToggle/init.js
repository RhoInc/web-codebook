export function init(codebook) {
  const container = codebook.controls.wrap
    .append("button")
    .attr("class","data-listing-toggle")
    .text(
      codebook.dataListing.wrap.style("display") === "none"
        ? "View data"
        : "View codebook"
    );
  container.on("click", function() {
    if (codebook.dataListing.wrap.style("display") === "none") {
      codebook.dataListing.wrap.classed("hidden", false);
      codebook.summaryTable.wrap.classed("hidden", true);
      container.text("View codebook");
    } else {
      codebook.dataListing.wrap.classed("hidden", true);
      codebook.summaryTable.wrap.classed("hidden", false);
      container.text("View data");
    }
  });
}
