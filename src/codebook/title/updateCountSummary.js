import { format as d3format } from 'd3';

export function updateCountSummary(codebook) {
  var warn = false;
  //get number of rows shown
  if (codebook.data.summary.length > 0) {
    var nShown = codebook.data.summary[0].statistics.N;
    var nTot = codebook.data.raw.length;
    var percent = d3format('0.1%')(nShown / nTot);
    var rowSummary =
      nShown + ' of ' + nTot + ' (' + percent + ') rows selected';
  } else {
    var rowSummary = 'No rows selected.';
    warn = true;
  }

  //Add note regarding highlighted cells and show/hide the clear highlight button
  var highlightSummary =
    codebook.data.highlighted.length > 0
      ? ' and ' +
        codebook.data.highlighted.length +
        ' <span class="highlightLegend">highlighted</span>. '
      : '.';

  codebook.title.highlight.clearButton.classed(
    'hidden',
    codebook.data.highlighted.length == 0
  );

  //get number of columns hidden
  var nCols_sub = codebook.data.summary.filter(d => !d.hidden).length;
  var nCols_all = codebook.data.summary.length - 1; //-1 is for the index var
  var nCols_diff = nCols_all - nCols_sub;
  //var percent = d3format('0.1%')(nCols_sub / nCols_all);
  var colSummary = nCols_diff > 0 ? nCols_diff + ' rows columns hidden' : '';

  var tableSummary = rowSummary + highlightSummary + ' ' + colSummary;

  codebook.title.countSummary.html(tableSummary);
}
