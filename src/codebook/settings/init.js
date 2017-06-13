export function init(codebook) {
  /**-------------------------------------------------------------------------------------------\
      Add control to update groups.
    \-------------------------------------------------------------------------------------------**/

  //Create list of fields in the data file.
  const updateGroups = codebook.settings.wrap
    .append("div")
    .classed("update-groups update-control", true)
    .text("Select group variables:"),
    groupList = updateGroups.append("ul"),
    groupItems = groupList
      .selectAll("li")
      .data(Object.keys(codebook.data.raw[0]))
      .enter()
      .append("li");

  //Append a checkbox to each list item, setting the 'checked' property to true for those whose
  //field name is already an option in the group control.
  groupItems.each(function(d) {
    d3.select(this).html(`<input type = "checkbox"> ${d}`);
    d3
      .select(this)
      .select("input")
      .property(
        "checked",
        codebook.config.groups.map(group => group.value_col).indexOf(d) > -1
      );
  });

  //Alter the checkbox functionality so the user can click anywhere in the list item to update
  //the group control.
  groupItems.each(function(d) {
    d3.select(this).select("input").on("click", function() {
      d3.select(this).property("checked", !d3.select(this).property("checked"));
    });
  });

  //Add click functionality to each list item.
  groupItems.on("click", function() {
    const li = d3.select(this),
      input = li.select("input"),
      checked = input.property("checked");
    input.property("checked", !checked);
    const groups = groupItems
      .filter(function() {
        return d3.select(this).select("input").property("checked");
      })
      .data();
    codebook.config.groups = groups.map(d => {
      return { value_col: d };
    });
    codebook.controls.groups.update(codebook);
    if (groups.indexOf(codebook.config.group) === -1) {
      delete codebook.config.group;
      codebook.data.makeSummary(codebook);
      codebook.summaryTable.draw(codebook);
      codebook.dataListing.init(codebook);
    }
  });

  /**-------------------------------------------------------------------------------------------\
      Add control to update filters.
    \-------------------------------------------------------------------------------------------**/

  //Create list of fields in the data file.
  const updateFilters = codebook.settings.wrap
    .append("div")
    .classed("update-filters update-control", true)
    .text("Select filter variables:"),
    filterList = updateFilters.append("ul"),
    filterItems = filterList
      .selectAll("li")
      .data(Object.keys(codebook.data.raw[0]))
      .enter()
      .append("li");

  //Append a checkbox to each list item, setting the 'checked' property to true for those whose
  //field name is already an option in the filter control.
  filterItems.each(function(d) {
    d3.select(this).html(`<input type = "checkbox"> ${d}`);
    d3
      .select(this)
      .select("input")
      .property(
        "checked",
        codebook.config.filters.map(filter => filter.value_col).indexOf(d) > -1
      );
  });

  //Alter the checkbox functionality so the user can click anywhere in the list item to update
  //the filter control.
  filterItems.each(function(d) {
    d3.select(this).select("input").on("click", function() {
      d3.select(this).property("checked", !d3.select(this).property("checked"));
    });
  });

  //Add click functionality to each list item.
  filterItems.on("click", function() {
    const li = d3.select(this),
      input = li.select("input"),
      checked = input.property("checked");
    input.property("checked", !checked);
    const filters = filterItems
      .filter(function() {
        return d3.select(this).select("input").property("checked");
      })
      .data();
    codebook.config.filters = filters.map(d => {
      return { value_col: d };
    });
    codebook.controls.filters.update(codebook);
    codebook.data.filtered = codebook.data.makeFiltered(
      codebook.data.raw,
      codebook.config.filters
    );
    if (filters.indexOf(codebook.config.filter) === -1) {
      codebook.data.makeSummary(codebook);
      codebook.summaryTable.draw(codebook);
      codebook.dataListing.init(codebook);
    }
  });
}
