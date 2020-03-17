/*------------------------------------------------------------------------------------------------\
  draw/update the summaryTable
\------------------------------------------------------------------------------------------------*/
import indicateLoading from '../util/indicateLoading';

export function draw(codebook) {
    //indicateLoading(
    //    codebook,
    //    'Summary table draw'
    //);

    //enter/update/exit for variableDivs
    //BIND the newest data
    var varRows = codebook.summaryTable.wrap
        .selectAll('div.variable-row')
        .data(codebook.data.summary, d => d.value_col);

    //ENTER
    varRows
        .enter()
        .append('div')
        .attr('class', function(d) {
            return 'variable-row ' + d.type;
        });

    //Hide variable rows corresponding to variables specified in settings.hiddenVariables.
    varRows.classed(
        'hidden',
        d => codebook.config.hiddenVariables.indexOf(d.value_col) > -1
    );

    //Set chart visibility (on initial load only - then keep user settings)
    if (codebook.config.chartVisibility != 'user-defined') {
        varRows.classed(
            'hiddenDetails',
            codebook.config.chartVisibility != 'visible'
        );
    }

    codebook.config.chartVisibility =
        codebook.config.chartVisibility == 'hidden' ? 'hidden' : 'user-defined';

    //ENTER + Update
    varRows.each(codebook.summaryTable.renderRow);

    //EXIT
    varRows.exit().remove();

    codebook.summaryTable.wrap.selectAll('div.status.error').remove();
    if (varRows[0].length == 0) {
        codebook.summaryTable.wrap
            .append('div')
            .attr('class', 'status error')
            .text(
                'No values selected. Update the filters above or load a different data set.'
            );
    }
}
