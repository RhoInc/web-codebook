import { select as d3select } from 'd3';
import reset from './updateSettings/reset';

export default function updateSettings(codebook, column) {
  const setting =
    column === 'Label'
      ? 'variableLabels'
      : column === 'Group'
        ? 'groups'
        : column === 'Filter'
          ? 'filters'
          : column === 'Hide'
            ? 'hiddenVariables'
            : column === 'Type'
              ? 'variableTypes'
              : console.warn('Something unsetting has occurred...');
  const inputs = codebook.settings.wrap.selectAll(`.column-table td.${column}`);
  if (['Group', 'Filter', 'Hide'].indexOf(column) > -1) {
    //redefine settings array
    codebook.config[setting] = inputs
      .filter(function() {
        return d3select(this)
          .select('input')
          .property('checked');
      })
      .data()
      .map(d => {
        return column !== 'Hide' ? { value_col: d.column } : d.column;
      });
  } else if (['Label', 'Type'].indexOf(column) > -1) {
    //redefine settings array
    var inputType = column == 'Label' ? 'input' : 'select';
    var currentValues = inputs
      .filter(function(d) {
        d.value.value = d3select(this)
          .select(inputType)
          .property('value');
        return d.value.value !== '';
      })
      .data()
      .map(d => {
        var obj = { value_col: d.column };
        obj[column.toLowerCase()] = d.value.value;
        return obj;
      });
    if (column == 'Type') {
      currentValues = currentValues.filter(f => f.type.slice(0, 4) != 'auto');
    }
    codebook.config[setting] = currentValues;
  }

  //reset
  reset(codebook);
}
