/*------------------------------------------------------------------------------------------------\
  Initialize filters.
\------------------------------------------------------------------------------------------------*/

import { nest as d3nest, select as d3select } from 'd3';
import { update } from './update';

//export function init(selector, data, vars, settings) {
export function init(codebook) {
  //initialize the wrapper
  const selector = codebook.controls.wrap
      .append('div')
      .attr('class', 'custom-filters'),
    filterList = selector.append('ul').attr('class', 'filter-list');

  update(codebook);
}
