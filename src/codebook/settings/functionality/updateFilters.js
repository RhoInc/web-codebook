import { select as d3select } from "d3";

export default function updateFilters(codebook) {
  const filterCheckBoxes = codebook.settings.wrap.selectAll(
    ".column-table td.Filter"
  );

  //Add click functionality to each list item.
  filterCheckBoxes.on("change", function() {
    const filters = filterCheckBoxes
      .filter(function() {
        return d3.select(this).select("input").property("checked");
      })
      .data()
      .map(d => d.column);

    //Add new filters to settings.filters.
    filters.forEach(filter => {
      if (codebook.config.filters.map(d => d.value_col).indexOf(filter) === -1)
        codebook.config.filters.push({ value_col: filter });
    });
    //Remove old  filters from settings.filters.
    codebook.config.filters.forEach((filter, i) => {
      if (filters.indexOf(filter.value_col) === -1)
        codebook.config.filters.splice(i, 1);
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
