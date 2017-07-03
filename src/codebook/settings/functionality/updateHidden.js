import { select as d3select } from 'd3';

export default function updateHidden(codebook) {
  const hiddenCheckBoxes = codebook.settings.wrap.selectAll(
    '.column-table td.Hidden'
  );

  //Add click functionality to each list item.
  hiddenCheckBoxes.on('change', function() {
    codebook.config.hiddenVariables = hiddenCheckBoxes
      .filter(function() {
        return d3select(this).select('input').property('checked');
      })
      .data()
      .map(d => d.column);

    //update hidden attribute in variable summary data array
    codebook.data.summary.forEach(d => {
      d.hidden = codebook.config.hiddenVariables.indexOf(d.value_col) > -1;
    });

    //Hide group-by options corresponding to variables specified in settings.hiddenVariables.
    codebook.controls.wrap
      .selectAll('.group-select option')
      .classed('hidden', d => codebook.config.hiddenVariables.indexOf(d) > -1);

    //Hide filters corresponding to variables specified in settings.hiddenVariables.
    codebook.controls.wrap
      .selectAll('.filter-list li.filterCustom')
      .classed(
        'hidden',
        d => codebook.config.hiddenVariables.indexOf(d.value_col) > -1
      );

    //update summary text
    codebook.summaryTable.updateSummaryText(codebook);

    //Hide variable rows corresponding to variables specified in settings.hiddenVariables.
    codebook.summaryTable.wrap
      .selectAll('div.variable-row')
      .classed(
        'hidden',
        d => codebook.config.hiddenVariables.indexOf(d.value_col) > -1
      );

    //Redraw data listing because columns corresponding to hidden variables will not be hidden until dataListing.onDraw() is called.
    codebook.dataListing.init(codebook);
  });
}
