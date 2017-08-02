import { select as d3select } from 'd3';

export default function makeDetails(d) {
  var wrap = d3select(this);

  //Render Row Toggle
  wrap
    .append('div')
    .attr('class', 'row-toggle')
    .html('&#9660;')
    .on('click', function() {
      var rowDiv = d3select(this.parentNode.parentNode.parentNode);
      var chartDiv = rowDiv.select('.row-chart');
      var hiddenFlag = rowDiv.classed('hiddenChart');
      rowDiv.classed('hiddenChart', !hiddenFlag);
      d3select(this).html(hiddenFlag ? '&#9660;' : '&#9658;');
    });

  //Render metadata
  var list = wrap.append('ul');
  var metaItems = list
    .selectAll('li.meta')
    .data(d.meta)
    .enter()
    .append('li')
    .classed('meta', true);

  metaItems.append('div').text(d => d.key).attr('class', 'label');
  metaItems.append('div').text(d => d.value).attr('class', 'value');

  //Render Summary Stats
  var ignoreStats = ['values', 'highlightValues', 'min', 'max'];
  var statNames = Object.keys(d.statistics)
    .filter(f => ignoreStats.indexOf(f) === -1) //remove value lists
    .filter(f => f.indexOf('ile') === -1); //remove "percentiles"

  var statList = statNames.map(stat => {
    return {
      key: stat !== 'nMissing' ? stat : 'Missing',
      value: d.statistics[stat]
    };
  });

  var stats = list
    .selectAll('li.stat')
    .data(statList)
    .enter()
    .append('li')
    .attr('class', 'stat');
  stats.append('div').text(d => d.key).attr('class', 'label');
  stats.append('div').text(d => d.value).attr('class', 'value');
}
