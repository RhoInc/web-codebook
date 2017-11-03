import { select as d3select } from 'd3';
import updateSettings from './updateSettings';

export function layout(codebook) {
  //Create list of columns in the data file.
  const columns = codebook.data.summary.map(d => d.value_col),
    groupColumns = codebook.config.groups.map(d => d.value_col),
    filterColumns = codebook.config.filters.map(d => d.value_col),
    hiddenColumns = codebook.config.hiddenVariables,
    labeledColumns = codebook.config.variableLabels.map(d => d.value_col),
    columnTableColumns = ['Column', 'Label', 'Group', 'Filter', 'Hide'],
    columnMetadata = columns.map(column => {
      const columnDatum = {
        Column: column,
        Label: {
          type: 'text',
          label: labeledColumns.indexOf(column) > -1
            ? codebook.config.variableLabels[labeledColumns.indexOf(column)]
                .label
            : ''
        },
        Group: {
          type: 'checkbox',
          checked: groupColumns.indexOf(column) > -1
        },
        Filter: {
          type: 'checkbox',
          checked: filterColumns.indexOf(column) > -1
        },
        Hide: {
          type: 'checkbox',
          checked: hiddenColumns.indexOf(column) > -1
        }
      };

      return columnDatum;
    }),
    //define table
    columnTable = codebook.settings.wrap
      .append('table')
      .classed('column-table', true),
    //define table headers
    columnTableHeader = columnTable.append('thead').append('tr'),
    columnTableHeaders = columnTableHeader
      .selectAll('th')
      .data(columnTableColumns)
      .enter()
      .append('th')
      .attr('class', d => d)
      .text(d => d),
    //define table rows
    columnTableRows = columnTable
      .append('tbody')
      .selectAll('tr')
      .data(columnMetadata)
      .enter()
      .append('tr')
      .classed('wc-hidden', d => d.Column === 'web-codebook-index'),
    columnTableCells = columnTableRows
      .selectAll('td')
      .data(d =>
        Object.keys(d).map(di => {
          return { column: d.Column, key: di, value: d[di] };
        })
      )
      .enter()
      .append('td')
      .attr('class', d => d.key)
      .each(function(d, i) {
        const cell = d3select(this);

        switch (d.key) {
          case 'Column':
            cell.text(d.value);
            break;
          case 'Label':
            cell.attr('title', 'Define variable label');
            cell
              .append('input')
              .attr('type', d.value.type)
              .property('value', d.value.label)
              .on('change', () => updateSettings(codebook, d.key));
            break;
          default:
            cell.attr(
              'title',
              `${d.value.checked ? 'Remove' : 'Add'} ${d.column} ${d.value
                .checked
                ? 'from'
                : 'to'} ${d.key.toLowerCase()} list`
            );
            const checkbox = cell
              .append('input')
              .attr('type', d.value.type)
              .property('checked', d.value.checked)
              .on('change', () => updateSettings(codebook, d.key));
        }
      });
}
