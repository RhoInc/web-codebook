import { select as d3select } from 'd3';
import reset from './updateSettings/reset';

export default function updateSettings(codebook, column) {
  const setting = column !== 'Hide'
    ? `${column.toLowerCase()}s`
    : 'hiddenVariables',
    checkBoxes = codebook.settings.wrap.selectAll(`.column-table td.${column}`);

  //redefine filter array
  codebook.config[setting] = checkBoxes
    .filter(function() {
      return d3select(this).select('input').property('checked');
    })
    .data()
    .map(d => {
      return column !== 'Hide' ? { value_col: d.column } : d.column;
    });

  //reset
  reset(codebook);
}
