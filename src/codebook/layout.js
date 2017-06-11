/*------------------------------------------------------------------------------------------------\
  Generate HTML containers.
\------------------------------------------------------------------------------------------------*/

export function layout() {
  this.nav.wrap = this.wrap.append("div").attr("class", "nav section");
  this.controls.wrap = this.wrap
    .append("div")
    .attr("class", "controls section");

  this.summaryTable.wrap = this.wrap
    .append("div")
    .attr("class", "summaryTable section")
    .classed("hidden", false);

  this.summaryTable.summaryText = this.summaryTable.wrap
    .append("strong")
    .attr("class", "summaryText section");

  this.dataListing.wrap = this.wrap
    .append("div")
    .attr("class", "dataListing section")
    .classed("hidden", true);
}
