/*------------------------------------------------------------------------------------------------\
  Update filters.
\------------------------------------------------------------------------------------------------*/

import { nest as d3nest, select as d3select } from 'd3';
import indicateLoading from '../../util/indicateLoading';

export function update(codebook) {
  const selector = codebook.controls.wrap.select('div.custom-filters'),
    filterList = selector.select('ul.filter-list');

  //add a list of values to each filter object
  codebook.config.filters.forEach(function(e) {
    if (!e.hasOwnProperty('values'))
      e.values = d3nest()
        .key(function(d) {
          return d[e.value_col];
        })
        .entries(codebook.data.raw)
        .map(function(d) {
          var obj = { value: d.key, selected: true };
          obj.label = /^\s*$/.test(d.key) ? '[No value provided]' : d.key;
          return obj;
        });
    e.label = codebook.data.summary.filter(
      d => d.value_col === e.value_col
    )[0].label;
  });

  //Add filter controls.
  var allFilterItem = filterList
    .selectAll('li')
    .data(codebook.config.filters, d => d.value_col);
  var columns = Object.keys(codebook.data.raw[0]);
  allFilterItem.exit().remove();
  var filterItem = allFilterItem
    .enter()
    .append('li')
    .attr('class', function(d) {
      return 'custom-' + d.value_col + ' filterCustom';
    });
  allFilterItem.classed(
    'hidden',
    d => codebook.config.hiddenVariables.indexOf(d.value_col) > -1
  );
  allFilterItem.sort((a, b) => {
    const aSort = columns.indexOf(a.value_col),
      bSort = columns.indexOf(b.value_col);
    return aSort - bSort;
  });

  var filterLabel = filterItem.append('span').attr('class', 'filterLabel');

  filterLabel
    .append('span')
    .classed('filter-variable', true)
    .html(d => d.value_col);
  filterLabel
    .append('span')
    .classed('filter-label', true)
    .html(d => (d.value_col !== d.label ? d.label : ''));

  var filterCustom = filterItem.append('select').attr('multiple', true);

  //Add data-driven filter options.
  var filterItems = filterCustom
    .selectAll('option')
    .data(function(d) {
      return d.values;
    })
    .enter()
    .append('option')
    .html(function(d) {
      return d.label;
    })
    .attr('value', function(d) {
      return d.value;
    })
    .attr('selected', d => (d.selected ? 'selected' : null));

  //Initialize event listeners
  var filters = codebook.controls.wrap
    .selectAll('.filterCustom select')
    .on('change', function(d) {
      indicateLoading(codebook, '#loading-indicator', () => {
        // flag the selected options in the config
        var options = d3select(this).selectAll('option');
        options.each(function(option_d) {
          option_d.selected = d3select(this).property('selected');
        });
        codebook.config.filters.filter(
          filter => filter.value_col === d.value_col
        )[0].values = options.data();

        //update the codebook
        codebook.data.filtered = codebook.data.makeFiltered(
          codebook.data.raw,
          codebook.config.filters
        );

        //clear highlights
        codebook.data.highlighted = [];
        codebook.data.makeSummary(codebook);
        codebook.title.updateCountSummary(codebook);
        codebook.summaryTable.draw(codebook);
        codebook.chartMaker.draw(codebook);
        codebook.dataListing.init(codebook);
      });
    });
}
