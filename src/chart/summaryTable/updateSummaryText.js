export function updateSummaryText(chart) {
  //Chart Summary Span
  if (chart.data.summary.length > 0) {
    var nCols = chart.data.summary.length;
    var nShown = chart.data.summary[0].statistics.N;
    var nTot = chart.data.raw.length;
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

  chart.summaryTable.summaryText.text(tableSummary);
}
