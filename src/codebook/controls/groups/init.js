/*------------------------------------------------------------------------------------------------\
  Initialize group control.
\------------------------------------------------------------------------------------------------*/

import { merge as d3merge } from "d3";

export function init(codebook) {
  if (codebook.config.groups.length > 0) {
    var selector = codebook.controls.wrap
      .append("div")
      .attr("class", "group-select");

    selector.append("span").text("Group by");

    var groupSelect = selector.append("select");

    var groupLevels = d3merge([
      ["None"],
      codebook.config.groups.map(m => m.value_col)
    ]);

    groupSelect
      .selectAll("option")
      .data(groupLevels, d => d)
      .enter()
      .append("option")
      .text(d => d);

    groupSelect.on("change", function() {
      if (this.value !== "None") codebook.config.group = this.value;
      else delete codebook.config.group;
      codebook.data.filtered = codebook.data.makeFiltered(
        codebook.data.raw,
        codebook.config.filters
      );
      codebook.data.makeSummary(codebook);
      codebook.summaryTable.draw(codebook);
    });
  }
}
