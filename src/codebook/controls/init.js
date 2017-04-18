export function init(codebook) {
  codebook.controls.wrap.attr("onsubmit", "return false;");
  codebook.controls.wrap.selectAll("*").remove(); //Clear controls.

  //Draw controls.
  codebook.controls.dataListingToggle.init(codebook);
  codebook.controls.groups.init(codebook);
  codebook.controls.chartToggle.init(codebook);
  codebook.controls.filters.init(codebook);
}
