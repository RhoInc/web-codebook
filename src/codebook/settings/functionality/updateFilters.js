import { select as d3select } from "d3";

export default function updateFilters(codebook) {
  const filterCheckBoxes = codebook.settings.wrap.selectAll(
    ".column-table .Filter input"
  );

  //Add click functionality to each list item.
  filterCheckBoxes.on("change", function() {
    const filters = filterCheckBoxes
      .filter(function() {
        return d3.select(this).property("checked");
      })
      .data()
      .map(d => d.Column);
    codebook.config.filters = filters.map(d => {
      return { value_col: d };
    });
    codebook.controls.filters.update(codebook);

    //Update filtered data and redraw codebook.
    codebook.data.filtered = codebook.data.makeFiltered(
      codebook.data.raw,
      codebook.config.filters
    );
    codebook.data.makeSummary(codebook);
    codebook.summaryTable.draw(codebook);
    codebook.dataListing.init(codebook);
  });
}
