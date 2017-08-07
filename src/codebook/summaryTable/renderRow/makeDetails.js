import { select as d3select } from 'd3';

export default function makeDetails(d) {
  var wrap = d3select(this);
  var parent = d3select(this.parentNode);
  var list = wrap.append('div').append('ul');
  var labelNav = parent
    .append('ul')
    .attr('class', 'type-label')
    .classed('hidden', true);
  parent
    .on('mouseover', function(d) {
      labelNav.classed('hidden', false);
    })
    .on('mouseout', function() {
      labelNav.classed('hidden', true);
    });

  //Layout mini-nav
  var navLevels = [
    { key: 'Stats', selected: true },
    { key: 'Meta', selected: false },
    { key: 'Values', selected: false }
  ];

  var labelItems = labelNav
    .selectAll('li')
    .data(navLevels)
    .enter()
    .append('li')
    .html(d => d.key)
    .classed('selected', d => d.selected);

  //Handlers for label events
  labelItems.on('click', function() {
    if (!d3select(this).classed('selected')) {
      labelItems.classed('selected', false);
      d3select(this).classed('selected', true);
      if (d3select(this).datum().key == 'Stats') {
        renderStats(d);
      } else if (d3select(this).datum().key == 'Meta') {
        renderMeta(d);
      }
    }
  });

  //Render metadata
  function renderMeta(d) {
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

    var stats = list
      .selectAll('li.stat')
      .data(statList)
      .enter()
      .append('li')
      .attr('class', 'stat');
    stats.append('div').text(d => d.key).attr('class', 'label');
    stats.append('div').text(d => d.value).attr('class', 'value');
  }

  //render stats on initial load
  renderStats(d);
}
