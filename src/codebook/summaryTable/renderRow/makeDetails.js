import { select as d3select } from 'd3';

export default function makeDetails(d) {
  var sections = ['Meta', 'Stats'];
  var wrap = d3select(this);
  var parent = d3select(this.parentNode);
  var list = wrap.append('div').append('ul');
  var label = parent.append('div').attr('class', 'type-label');

  //Render metadata
  function renderMeta(d) {
    label.text('Meta');
    list.selectAll('*').remove();
    console.log(d);
    var metaItems = list
      .selectAll('li.meta')
      .data(d.meta)
      .enter()
      .append('li')
      .classed('meta', true)
      .classed('hidden', d => d.hidden);

    metaItems.append('div').text(d => d.key).attr('class', 'label');
    metaItems.append('div').text(d => d.value).attr('class', 'value');
  }

  //Render Summary Stats
  function renderStats(d) {
    label.text('Stats');
    list.selectAll('*').remove();

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

    console.log(statList);
    var stats = list
      .selectAll('li.stat')
      .data(statList)
      .enter()
      .append('li')
      .attr('class', 'stat');
    stats.append('div').text(d => d.key).attr('class', 'label');
    stats.append('div').text(d => d.value).attr('class', 'value');
  }

  label.on('click', function() {
    if (d3select(this).text() == 'Meta') {
      renderStats(d);
    } else if (d3select(this).text() == 'Stats') {
      renderMeta(d);
    }
  });
  //render stats on initial load
  renderStats(d);
}
