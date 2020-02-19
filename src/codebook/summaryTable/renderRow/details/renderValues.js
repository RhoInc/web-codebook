import {
  select as d3select,
  format as d3format,
  set as d3set,
  merge as d3merge
} from 'd3';

export default function renderValues(d, list) {
  //make a list of values
  if (d.type == 'categorical') {
    var topValues = d.statistics.values
      .sort(function(a, b) {
        return b.n - a.n;
      })
      .filter(function(d, i) {
        return i < 5;
      });

    var valueItems = list
      .selectAll('li.value')
      .data(topValues)
      .enter()
      .append('li')
      .attr('class', 'value');

    valueItems
      .append('div')
      .text(d => d.key)
      .attr('class', 'wcb-label')
      .attr('title', d => d.key);

    valueItems
      .append('div')
      .text(d => d.n + ' (' + d3format('0.1%')(d.prop_n) + ')')
      .attr('class', 'value');

    if (d.statistics.values.length > 5) {
      var totLength = d.statistics.values.length;
      var extraCount = totLength - 5;
      var extra_span = list
        .append('li')
        .attr('class', 'value')
        .append('div')
        .attr('class', 'wcb-label')
        .html('and ' + extraCount + ' more.');
    }
  } else if (d.type == 'continuous') {
    let nonMissing = d.values.filter(f => !f.missing).map(m => +m.value);
    var sortedValues = d3set(nonMissing)
      .values() //get unique
      .sort(function(a, b) {
        return a - b;
      }); // sort low to high

    if (sortedValues.length > 6) {
      var minValues = sortedValues.filter(function(d, i) {
        return i < 3;
      });
      var nValues = sortedValues.length;
      var maxValues = sortedValues.filter(function(d, i) {
        return i >= nValues - 3;
      });
      var valList = d3merge([minValues, ['...'], maxValues]);
    } else {
      var valList = sortedValues;
    }
    var valueItems = list
      .selectAll('li.value')
      .data(valList)
      .enter()
      .append('li')
      .attr('class', 'value');

    valueItems
      .append('div')
      .attr('class', 'wcb-label')
      .text(function(d, i) {
        return i == 0 ? 'Min' : i == valList.length - 1 ? 'Max' : ' ';
      });
    valueItems
      .append('div')
      .attr('class', 'value')
      .text(d => d)
      .attr('title', d => (d == '...' ? nValues - 6 + ' other values' : ''))
      .style('cursor', d => (d == '...' ? 'help' : null));
  }
}
