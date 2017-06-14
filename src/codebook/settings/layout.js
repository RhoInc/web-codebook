export function layout(codebook) {
  //Create list of columns in the data file.
  const columns = Object.keys(codebook.data.raw[0]),
    groupColumns = codebook.config.groups.map(d => d.value_col),
    filterColumns = codebook.config.groups.map(d => d.value_col),
    columnTableColumns = ["Column", "Group", "Filter"], //, 'Visibility', 'Label'],
    columnMetadata = columns.map(column => {
      const columnDatum = {
        Column: column,
        Group: {
          type: "checkbox",
          checked: groupColumns.indexOf(column) > -1
        },
        Filter: {
          type: "checkbox",
          checked: filterColumns.indexOf(column) > -1
        }
        /*,'Visibility':
                            {type: 'checkbox'
                            ,checked: true}
                        ,'Label':
                            {type: 'text'
                            ,checked: filterColumns.indexOf(column) > -1}*/
      };

      return columnDatum;
    }),
    columnTable = codebook.settings.wrap
      .append("table")
      .classed("column-table", true),
    columnTableHeader = columnTable.append("thead").append("tr"),
    columnTableHeaders = columnTableHeader
      .selectAll("th")
      .data(columnTableColumns)
      .enter()
      .append("th")
      .attr("class", d => d)
      .text(d => d),
    columnTableRows = columnTable
      .append("tbody")
      .selectAll("tr")
      .data(columnMetadata)
      .enter()
      .append("tr");
  columnTableRows.each(function(rowDatum) {
    const row = d3.select(this), dataColumn = rowDatum.Column;

    for (const rowProperty in rowDatum) {
      const cell = row.append("td").classed(rowProperty, true),
        cellDatum = rowDatum[rowProperty];
      console.log(cell);
      console.log(cellDatum);
      if (typeof rowDatum[rowProperty] !== "object") cell.text(cellDatum);
      else {
        cell.attr(
          "title",
          `${cellDatum.checked ? "Remove" : "Add"} ${dataColumn} ${cellDatum.checked ? "from" : "to"} ${rowProperty.toLowerCase()} list`
        );
        cell
          .append("input")
          .attr("type", cellDatum.type)
          .property("checked", cellDatum.checked);
      }
    }
  });

  //Add descriptive footnote.
  columnTable
    .select("tbody")
    .append("tr")
    .style("border-bottom", "none")
    .append("td")
    .attr("colspan", "5")
    .text(
      "This interactive table allows users to modify each column's metadata."
    );
}
