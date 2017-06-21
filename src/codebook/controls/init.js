export function init(codebook) {
  codebook.controls.wrap.attr("onsubmit", "return false;");
  codebook.controls.wrap.selectAll("*:not(#loading-indicator)").remove(); //Clear controls.

  codebook.loadingIndicator = codebook.controls.wrap
    .insert("div", ":first-child")
    .attr("id", "loading-indicator");

  //Draw title
  codebook.controls.wrap
    .append("div")
    .attr("class", "controls-title")
    .text("Codebook Controls");

  //Draw controls.
  codebook.controls.groups.init(codebook);
  codebook.controls.chartToggle.init(codebook);
  codebook.controls.filters.init(codebook);
  codebook.controls.controlToggle.init(codebook);
}
