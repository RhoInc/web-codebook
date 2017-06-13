/*------------------------------------------------------------------------------------------------\
  Update group control.
\------------------------------------------------------------------------------------------------*/

import { merge as d3merge } from "d3";

export function update(codebook) {
  const groupControl = codebook.controls.wrap.select("div.group-select"),
    groupSelect = groupControl.select("select"),
    groupLevels = d3merge([
      ["None"],
      codebook.config.groups.map(m => m.value_col)
    ]),
    groupOptions = groupSelect.selectAll("option").data(groupLevels, d => d);
  groupOptions.enter().append("option").text(d => d);
  groupOptions.exit().remove();
}
