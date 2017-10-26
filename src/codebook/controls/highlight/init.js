/*------------------------------------------------------------------------------------------------\
  Initialize clear highlighting button.
\------------------------------------------------------------------------------------------------*/

export function init(codebook) {
  //initialize the wrapper
  codebook.controls.highlight.clearButton = codebook.controls.summaryWrap
    .append('button')
    .classed('clear-highlight', true)
    .classed('hidden', codebook.data.highlighted.length == 0)
    .text('Clear Highlighting')
    .on('click', function() {
      codebook.data.highlighted = [];

      codebook.data.makeSummary(codebook);
      codebook.dataListing.init(codebook);
      codebook.summaryTable.draw(codebook);
      codebook.chartMaker.draw(codebook);
      codebook.controls.updateRowCount(codebook);
    });
}
