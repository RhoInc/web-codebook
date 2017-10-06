/*------------------------------------------------------------------------------------------------\
  Initialize detail select
\------------------------------------------------------------------------------------------------*/
import { select as d3select } from 'd3';

export function init(codebook) {
  //X & Y Variables
  var x_wrap = codebook.chartMaker.controlsWrap
    .append('span')
    .attr('class', 'control column-select x');

  var y_wrap = codebook.chartMaker.controlsWrap
    .append('span')
    .attr('class', 'control column-select y');

  x_wrap.append('small').html('x variable: ');
  y_wrap.append('small').html('y variable: ');

  var x_select = x_wrap.append('select');
  var y_select = y_wrap.append('select');

  var x_items = x_select
    .selectAll('option')
    .data(codebook.data.summary)
    .enter()
    .append('option')
    .property('selected', function(d, i) {
      return i == 0;
    })
    .html(d => d.label);

  var y_items = y_select
    .selectAll('option')
    .data(codebook.data.summary)
    .enter()
    .append('option')
    .property('selected', function(d, i) {
      return i == 1;
    })
    .html(d => d.label);

  //Handlers for label events
  x_select.on('change', function() {
    codebook.chartMaker.draw(codebook);
  });

  y_select.on('change', function() {
    codebook.chartMaker.draw(codebook);
  });
}
