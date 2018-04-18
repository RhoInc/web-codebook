/*------------------------------------------------------------------------------------------------\
  Initialize clear highlighting button.
\------------------------------------------------------------------------------------------------*/

export function init(codebook) {
  //initialize the wrapper
  console.log('make hl button');
  codebook.title.highlight.clearButton = codebook.title.wrap
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
      codebook.title.updateCountSummary(codebook);
    });
}
