import { select as d3select } from 'd3';
import reset from './updateSettings/reset';

export default function updateSettings(codebook, column) {
  const setting = column === 'Label'
    ? 'variableLabels'
    : column === 'Group'
      ? 'groups'
      : column === 'Filter'
        ? 'filters'
        : column === 'Hide'
          ? 'hiddenVariables'
          : console.warn('Something unsetting has occurred...');
  const inputs = codebook.settings.wrap.selectAll(`.column-table td.${column}`);
  if (['Group', 'Filter', 'Hide'].indexOf(column) > -1) {
    //redefine settings array
    codebook.config[setting] = inputs
      .filter(function() {
        return d3select(this).select('input').property('checked');
      })
      .data()
      .map(d => {
        return column !== 'Hide' ? { value_col: d.column } : d.column;
      });
  } else if (['Label'].indexOf(column) > -1) {
    //redefine settings array
    codebook.config[setting] = inputs
      .filter(function(d) {
        d.value.label = d3select(this).select('input').property('value');
        return d.value.label !== '';
      })
      .data()
      .map(d => {
        return { value_col: d.column, label: d.value.label };
      });
  }

  //reset
  reset(codebook);
}
