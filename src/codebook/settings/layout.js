export function layout(codebook) {
  //Create list of columns in the data file.
  const columns = codebook.data.summary.map(d => d.value_col),
    groupColumns = codebook.config.groups.map(d => d.value_col),
    filterColumns = codebook.config.filters.map(d => d.value_col),
    hiddenColumns = codebook.config.hiddenVariables,
    columnTableColumns = ["Column", "Group", "Filter", 'Hidden'],
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
        },
        Hidden: {
            type: 'checkbox',
            checked: hiddenColumns.indexOf(column) > -1}
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
      .append("tr"),
    columnTableCells = columnTableRows
      .selectAll("td")
      .data(d =>
        Object.keys(d).map(di => {
          return { column: d.Column, key: di, value: d[di] };
        })
      )
      .enter()
      .append("td")
      .attr("class", d => d.key)
      .each(function(d, i) {
        const cell = d3.select(this);

        switch (d.key) {
          case "Column":
            cell.text(d.value);
            break;
          default:
            cell.attr(
              "title",
              `${d.value.checked ? "Remove" : "Add"} ${d.column} ${d.value.checked ? "from" : "to"} ${d.key.toLowerCase()} list`
            );
            cell
              .append("input")
              .attr("type", d.value.type)
              .property("checked", d.value.checked);
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
