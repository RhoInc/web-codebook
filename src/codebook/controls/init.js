export function init(codebook) {
  codebook.controls.wrap.attr("onsubmit", "return false;");
  codebook.controls.wrap.selectAll("*").remove(); //Clear controls.

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

  //Hide group-by options corresponding to variables specified in settings.hiddenVariables.
  codebook.controls.wrap
    .selectAll(".group-select option")
    .classed("hidden", d => codebook.config.hiddenVariables.indexOf(d) > -1);

  //Hide filters corresponding to variables specified in settings.hiddenVariables.
  codebook.controls.wrap
    .selectAll(".filter-list li.filterCustom")
    .classed(
      "hidden",
      d => codebook.config.hiddenVariables.indexOf(d.value_col) > -1
    );
}
