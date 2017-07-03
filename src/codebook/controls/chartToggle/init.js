/*------------------------------------------------------------------------------------------------\
  Initialize custom controls.
\------------------------------------------------------------------------------------------------*/

//export function init(selector, data, vars, settings) {
export function init(codebook) {
  //initialize the wrapper
  var selector = codebook.controls.wrap
    .append('div')
    .attr('class', 'chart-toggle');

  var showAllButton = selector
    .append('button')
    .text('Show All Charts')
    .on('click', function() {
      codebook.wrap.selectAll('.variable-row').classed('hiddenChart', false);
      codebook.wrap.selectAll('.row-toggle').html('&#9660;');
    });

  var hideAllButton = selector
    .append('button')
    .text('Hide All Charts')
    .on('click', function() {
      codebook.wrap.selectAll('.variable-row').classed('hiddenChart', true);
      codebook.wrap.selectAll('.row-toggle').html('&#9658;');
    });
}
