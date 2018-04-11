import { select as d3select } from 'd3';
import detailList from './details/detailList';
import renderStats from './details/renderStats';
import renderValues from './details/renderValues';

export default function makeDetails(d) {
  var stat_list = d3select(this)
    .append('ul')
    .attr('class', 'stats');
  var val_list = d3select(this)
    .append('ul')
    .attr('class', 'values');

  var parent = d3select(this.parentNode.parentNode);

  /*
  controls.append('small').html('Header Details: ');
  var detailSelect = controls.append('select');

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
    detailObj.action(d, list);
  });
*/
  //render stats & values on initial load
  renderStats(d, stat_list);
  renderValues(d, val_list);
}
