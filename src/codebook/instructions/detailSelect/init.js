/*------------------------------------------------------------------------------------------------\
  Initialize detail select
\------------------------------------------------------------------------------------------------*/
import detailList from '../../summaryTable/renderRow/details/detailList';
import { select as d3select } from 'd3';

//export function init(selector, data, vars, settings) {
export function init(codebook) {
  //initialize the wrapper
  var control = codebook.instructions.wrap
    .append('span')
    .attr('class', 'control detail-select');

  control.append('small').html('Header Details: ');
  var detailSelect = control.append('select');

  var detailItems = detailSelect
    .selectAll('option')
    .data(detailList)
    .enter()
    .append('option')
    .html(d => d.key);

  //Handlers for label events
  detailSelect.on('change', function() {
    var current = this.value;
    var detailObj = detailList.filter(f => f.key == current)[0];

    codebook.wrap.selectAll('.variable-row').each(function(d) {
      //show the requested detail for each row
      var list = d3select(this).select('.row-head .row-details ul');
      detailObj.action(d, list);

      //update the select on each row
      d3select(this)
        .select('.row-chart .row-controls .detail-controls select')
        .property('value', current);
    });
  });
}
