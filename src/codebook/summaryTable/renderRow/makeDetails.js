import { select as d3select } from 'd3';
import detailList from './details/detailList';
import renderStats from './details/renderStats';

export default function makeDetails(d) {
  var list = d3select(this)
    .append('div')
    .append('ul');
  var parent = d3select(this.parentNode.parentNode);
  var controls = parent
    .select('.row-chart')
    .select('.row-controls')
    .append('div')
    .attr('class', 'detail-controls');

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

  //render stats on initial load
  renderStats(d, list);
}
