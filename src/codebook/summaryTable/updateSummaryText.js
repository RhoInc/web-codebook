export function updateSummaryText(codebook) {
  //Chart Summary Span
  if (codebook.data.summary.length > 0) {
    var nCols = codebook.data.summary.length;
    var nShown = codebook.data.summary[0].statistics.N;
    var nTot = codebook.data.raw.length;
    var percent = d3.format("0.1%")(nShown / nTot);
    var tableSummary =
      "Data summary for " +
      nCols +
      " columns and " +
      nShown +
      " of " +
      nTot +
      " (" +
      percent +
      ") rows shown below.";
  } else {
    tableSummary =
      "No values selected. Update the filters above or load a different data set.";
  }

  codebook.summaryTable.summaryText.text(tableSummary);
}
