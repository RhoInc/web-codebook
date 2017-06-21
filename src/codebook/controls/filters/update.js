/*------------------------------------------------------------------------------------------------\
  Update filters.
\------------------------------------------------------------------------------------------------*/

import { nest as d3nest, select as d3select } from "d3";

export function update(codebook) {
  const selector = codebook.controls.wrap.select("div.custom-filters"),
    filterList = selector.select("ul.filter-list");

  //add a list of values to each filter object
  codebook.config.filters.forEach(function(e) {
    e.values = d3nest()
      .key(function(d) {
        return d[e.value_col];
      })
      .entries(codebook.data.raw)
      .map(function(d) {
        return { value: d.key, selected: true };
      });
  });

  //Add filter controls.
  var allFilterItem = filterList
    .selectAll("li")
    .data(codebook.config.filters, d => d.value_col);
  var columns = Object.keys(codebook.data.raw[0]);
  var filterItem = allFilterItem
    .enter()
    .append("li")
    .attr("class", function(d) {
      return "custom-" + d.value_col + " filterCustom";
    });
  allFilterItem.exit().remove();
  allFilterItem.sort((a, b) => {
    const aSort = columns.indexOf(a.value_col),
      bSort = columns.indexOf(b.value_col);
    return aSort - bSort;
  });

  var filterLabel = filterItem.append("span").attr("class", "filterLabel");

  filterLabel.append("span").html(d => d.label || d.value_col);

  var filterCustom = filterItem.append("select").attr("multiple", true);

  //Add data-driven filter options.
  var filterItems = filterCustom
    .selectAll("option")
    .data(function(d) {
      return d.values;
    })
    .enter()
    .append("option")
    .html(function(d) {
      return d.value;
    })
    .attr("value", function(d) {
      return d.value;
    })
    .attr("selected", d => (d.selected ? "selected" : null));

  //Initialize event listeners
  filterCustom.on("change", function() {
    //display the loading indicator
    codebook.loadingIndicator.style("display", "block");
    //wait by the quarter second until the loading indicator is visible to re-render everything
    const loading = setInterval(() => {
      const display = codebook.loadingIndicator.style("display");
      if (display === "block") {
        // flag the selected options in the config
        d3select(this).selectAll("option").each(function(option_d) {
          option_d.selected = d3select(this).property("selected");
        });

        //update the codebook
        codebook.data.filtered = codebook.data.makeFiltered(
          codebook.data.raw,
          codebook.config.filters
        );
        codebook.data.makeSummary(codebook);
        codebook.summaryTable.draw(codebook);
        codebook.dataListing.init(codebook);

        //loading complete
        clearInterval(loading);
        codebook.loadingIndicator.style("display", "none");
      }
    }, 250);
  });
}
