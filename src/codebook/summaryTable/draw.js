/*------------------------------------------------------------------------------------------------\
  draw/update the summaryTable
\------------------------------------------------------------------------------------------------*/

export function draw(codebook) {
  //enter/update/exit for variableDivs
  //BIND the newest data
  var varRows = codebook.summaryTable.wrap
    .selectAll('div.variable-row')
    .data(codebook.data.summary, d => d.value_col);

  //ENTER
  varRows.enter().append('div').attr('class', function(d) {
    return 'variable-row ' + d.type;
  });

  //Hide variable rows corresponding to variables specified in settings.hiddenVariables.
  varRows.classed(
    'hidden',
    d => codebook.config.hiddenVariables.indexOf(d.value_col) > -1
  );

  //ENTER + Update
  varRows.each(codebook.summaryTable.renderRow);

  //EXIT
  varRows.exit().remove();
}
