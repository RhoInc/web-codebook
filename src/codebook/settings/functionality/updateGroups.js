import { select as d3select } from "d3";

export default function updateGroups(codebook) {
  const groupCheckBoxes = codebook.settings.wrap.selectAll(
    ".column-table td.Group"
  );

  //Add click functionality to each list item.
  groupCheckBoxes.on("change", function() {
    const groups = groupCheckBoxes
      .filter(function() {
        return d3select(this).select("input").property("checked");
      })
      .data()
      .map(d => d.column);
    codebook.config.groups = groups.map(d => {
      return { value_col: d };
    });
    codebook.controls.groups.update(codebook);

    //Redraw codebook if currently grouped by former group column.
    if (codebook.config.group && groups.indexOf(codebook.config.group) === -1) {
      delete codebook.config.group;
      codebook.data.makeSummary(codebook);
      codebook.summaryTable.draw(codebook);
    }
  });
}
