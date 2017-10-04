import { select as d3select } from 'd3';

export default function onDraw(dataListing) {
  dataListing.table.on('draw', function() {
    //Attach variable name rather than variable label to header to be able to apply settings.hiddenVariables to column headers.
    this.table.selectAll('th').attr('title', d => {
      const label = dataListing.config.variableLabels.filter(
        di => di.value_col === d
      )[0];
      return label ? label.label : null;
    });

    //Hide data listing columns corresponding to variables specified in settings.hiddenVariables.
    this.table
      .selectAll('th,td')
      .classed(
        'hidden',
        d => dataListing.config.hiddenVariables.indexOf(d.col ? d.col : d) > -1
      );

    //highlight rows
    this.table.selectAll('tr').classed('highlight', function(d) {
      return dataListing.codebook.data.highlighted.indexOf(d.raw) > -1;
    });
  });
}
