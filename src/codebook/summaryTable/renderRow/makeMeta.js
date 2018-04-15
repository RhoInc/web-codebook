import { select as d3select } from 'd3';
import renderMeta from './details/renderMeta';

export default function makeMeta(d) {
  var hasMeta =
    d.meta.filter(f => !f.hidden).filter(f => f.key != 'Type').length > 0;
  if (hasMeta) {
    var meta_list = d3select(this)
      .append('ul')
      .attr('class', 'meta');

    var parent = d3select(this.parentNode.parentNode);
    renderMeta(d, meta_list);
  } else {
    d3select(this).style('display', 'none');
  }
}
