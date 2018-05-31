//Render metadata
export default function renderMeta(d, list) {
  list.selectAll('*').remove();

  // don't renderer items with no
  var dropped = [];
  d.meta.forEach(function(d) {
    if (!d.value) {
      d.hidden = true;
      dropped.push(' "' + d.key + '"');
    }
  });

  //render the items
  var metaItems = list
    .selectAll('li.meta')
    .data(d.meta.filter(f => f.key != 'Type'))
    .enter()
    .append('li')
    .classed('meta', true)
    .classed('hidden', d => d.hidden);

  metaItems
    .append('div')
    .text(d => d.key)
    .attr('class', 'wcb-label');
  metaItems
    .append('div')
    .text(d => d.value)
    .attr('class', 'value');

  if (dropped.length) {
    list
      .append('li')
      .attr('class', 'details')
      .append('div')
      .html('&#9432;')
      .property(
        'title',
        'Meta data for ' +
          dropped.length +
          ' item(s) (' +
          dropped.toString() +
          ') were empty and are hidden.'
      );
  }
}
