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

    //render stats & values on initial load
    renderStats(d, stat_list);
    renderValues(d, val_list);
}
