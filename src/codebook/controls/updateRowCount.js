import { format as d3format } from 'd3';

export function updateRowCount(codebook) {
  if (codebook.data.summary.length > 0) {
    var nShown = codebook.data.summary[0].statistics.N;
    var nTot = codebook.data.raw.length;
    var percent = d3format('0.1%')(nShown / nTot);
    var tableSummary =
      nShown + ' of ' + nTot + ' (' + percent + ') rows selected';
    codebook.controls.rowCount.text(tableSummary).classed('warn', false);
  } else {
    codebook.controls.rowCount.text('No rows selected.').classed('warn', true);
  }

  //Add note regarding highlighted cells and show/hide the clear highlight button
  if (codebook.data.highlighted.length > 0) {
    codebook.controls.highlightCount.html(
      ' and ' +
        codebook.data.highlighted.length +
        ' <span class="highlightLegend">highlighted</span>. '
    );
    codebook.controls.highlight.clearButton.classed('wc-hidden', false);
  } else {
    codebook.controls.highlightCount.text('');
    codebook.controls.highlight.clearButton.classed('wc-hidden', true);
  }
}
