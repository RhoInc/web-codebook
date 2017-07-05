/*------------------------------------------------------------------------------------------------\
  Initialize clear highlighting button.
\------------------------------------------------------------------------------------------------*/

export function init(codebook) {
  //initialize the wrapper
  var selector = codebook.wrap
    .insert('div', ':first-child')
    .classed('clear-highlight hidden', true);

  var button = selector
    .append('button')
    .classed('clear-highlight', true)
    .text('Clear Highlighting')
    .on('click', function() {
      codebook.data.highlighted = [];
      codebook.dataListing.init(codebook);
      selector.classed('hidden', true);
    });
}
