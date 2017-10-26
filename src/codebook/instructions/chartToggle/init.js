/*------------------------------------------------------------------------------------------------\
  Initialize show/hide all charts toggles.
\------------------------------------------------------------------------------------------------*/

//export function init(selector, data, vars, settings) {
export function init(codebook) {
  //initialize the wrapper
  var selector = codebook.instructions.wrap
    .append('span')
    .attr('class', 'control chart-toggle')
    .classed('hidden', codebook.config.chartVisibility == 'hidden');

  selector.append('small').text('Toggle Charts: ');
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
