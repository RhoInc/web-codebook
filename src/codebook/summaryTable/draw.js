/*------------------------------------------------------------------------------------------------\
  draw/update the summaryTable
\------------------------------------------------------------------------------------------------*/
import indicateLoading from '../util/indicateLoading';

export function draw(codebook) {
  indicateLoading(
    codebook,
    '.web-codebook .summaryTable .variable-row .row-title'
  );

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
    'wc-hidden',
    d => codebook.config.hiddenVariables.indexOf(d.value_col) > -1
  );

  //ENTER + Update
  varRows.each(codebook.summaryTable.renderRow);

  //EXIT
  varRows.exit().remove();
}
