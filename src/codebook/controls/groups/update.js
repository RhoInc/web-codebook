/*------------------------------------------------------------------------------------------------\
  Update group control.
\------------------------------------------------------------------------------------------------*/

import { merge as d3merge } from 'd3';

export function update(codebook) {
  const groupControl = codebook.controls.wrap.select('div.group-select'),
    groupSelect = groupControl.select('select'),
    columns = Object.keys(codebook.data.raw[0]),
    groupLevels = d3merge([
      ['None'],
      codebook.config.groups.map(m => m.value_col)
    ]),
    groupOptions = groupSelect.selectAll('option').data(groupLevels, d => d);
  groupOptions.enter().append('option').text(d => d);
  groupOptions.exit().remove();
  groupOptions.sort((a, b) => columns.indexOf(a) - columns.indexOf(b));
  groupSelect.on('change', function() {
    if (this.value !== 'None') codebook.config.group = this.value;
    else delete codebook.config.group;
    codebook.data.makeSummary(codebook);
    codebook.summaryTable.draw(codebook);
  });
}
