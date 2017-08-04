/*------------------------------------------------------------------------------------------------\
  Update group control.
\------------------------------------------------------------------------------------------------*/

import { merge as d3merge } from 'd3';
import { select as d3select } from 'd3';
import indicateLoading from '../../util/indicateLoading';

export function update(codebook) {
  const groupControl = codebook.controls.wrap.select('div.group-select'),
    groupSelect = groupControl.select('select'),
    columns = Object.keys(codebook.data.raw[0]),
    groupLevels = d3merge([
      [{ value_col: 'None', label: 'None' }],
      codebook.config.groups.map(m => {
        return {
          value_col: m.value_col,
          label: codebook.data.summary.filter(
            variable => variable.value_col === m.value_col
          )[0].label
        };
      })
    ]),
    groupOptions = groupSelect
      .selectAll('option')
      .data(groupLevels, d => d.value_col);
  groupOptions
    .enter()
    .append('option')
    .property(
      'label',
      d =>
        d.value_col !== d.label ? `${d.value_col} (${d.label})` : d.value_col
    )
    .text(d => d.value_col);
  groupOptions.exit().remove();
  groupOptions.classed(
    'hidden',
    d => codebook.config.hiddenVariables.indexOf(d.value_col) > -1
  );
  groupOptions.sort((a, b) => columns.indexOf(a) - columns.indexOf(b));
  groupSelect.on('change', function() {
      indicateLoading(codebook, '#loading-indicator', () => {

        if (this.value !== 'None') codebook.config.group = this.value;
        else delete codebook.config.group;

        codebook.data.highlighted = [];
        codebook.data.makeSummary(codebook);
        codebook.summaryTable.draw(codebook);
        codebook.controls.updateRowCount(codebook);
      });
  });
}
