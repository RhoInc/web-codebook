export function init(codebook) {
  codebook.controls.wrap.attr("onsubmit", "return false;");
  codebook.controls.wrap.selectAll("*").remove(); //Clear controls.

  //Draw title
  codebook.controls.wrap
  .append("div")
  .attr("class","controls-title")
  .text("Codebook Controls")

  //Draw controls.
  codebook.controls.dataListingToggle.init(codebook);
  codebook.controls.groups.init(codebook);
  codebook.controls.chartToggle.init(codebook);
  codebook.controls.filters.init(codebook);
  codebook.controls.controlToggle.init(codebook);

}
