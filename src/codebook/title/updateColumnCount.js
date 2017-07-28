import { format as d3format } from 'd3';

export function updateColumnCount(codebook) {
  var nCols_sub = codebook.data.summary.filter(d => !d.hidden).length;
  var nCols_all = codebook.data.summary.length;
  var percent = d3format('0.1%')(nCols_sub / nCols_all);
  var tableSummary =
    nCols_sub + ' of ' + nCols_all + ' (' + percent + ') columns selected.';
  codebook.title.countSpan.text(tableSummary);
}
