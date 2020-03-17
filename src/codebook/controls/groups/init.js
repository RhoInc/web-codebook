/*------------------------------------------------------------------------------------------------\
  Initialize group control.
\------------------------------------------------------------------------------------------------*/

import { merge as d3merge } from 'd3';
import { update } from './update';

export function init(codebook) {
    var selector = codebook.controls.wrap
        .append('div')
        .attr('class', 'group-select');
    selector.append('span').text('Group by');
    var groupSelect = selector.append('select');
    update(codebook);
}
