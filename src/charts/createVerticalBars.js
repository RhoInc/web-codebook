import clone from '../util/clone';
import onResize from './verticalBars/onResize';
import onInit from './verticalBars/onInit';
import axisSort from './verticalBars/axisSort';
import { createChart } from 'webcharts';
import { select as d3select, max as d3max } from 'd3';

export function createVerticalBars(this_, d) {
  const chartContainer = d3select(this_).node();
  const rowSelector = d3select(this_).node().parentNode;
  var sortType = d3select(rowSelector)
    .select('.row-controls .x-axis-sort select')
    .property('value');
  var outcome = d3select(rowSelector)
    .select('.row-controls .y-axis-outcome select')
    .property('value');
  const chartSettings = {
    y: {
      column: outcome === 'rate' ? 'prop_n' : 'n',
      type: 'linear',
      label: '',
      format: outcome === 'rate' ? '0.1%' : 'd',
      domain: [0, null]
    },
    x: {
      column: 'key',
      type: 'ordinal',
      label: ''
    },
    marks: [
      {
        type: 'bar',
        per: ['key'],
        attributes: {
          stroke: null,
          fill: '#999'
        }
      }
    ],
    gridlines: '',
    resizable: false,
    height: this_.height,
    margin: this_.margin,
    value_col: d.value_col,
    group_col: d.group || null,
    overall: d.statistics.values,
    gridlines: 'y',
    sort: sortType //Alphabetical, Ascending, Descending
  };

  chartSettings.margin.bottom = 10;

  const chartData = d.statistics.values.sort(function(a, b) {
    return axisSort(a, b, chartSettings.sort);
  });

  chartSettings.x.order = chartData.map(d => d.key);
  var x_dom = chartData.map(d => d.key);

  if (d.groups) {
    //Set upper limit of y-axis domain to the maximum group rate.
    chartSettings.y.domain[1] = d3max(d.groups, di =>
      d3max(di.statistics.values, dii => dii[chartSettings.y.column])
    );

    chartSettings.x.domain = x_dom; //use the overall x domain in paneled charts
    d.groups.forEach(group => {
      //Define group-level settings.
      group.chartSettings = clone(chartSettings);
      group.chartSettings.group_val = group.group;
      group.chartSettings.n = group.values.length;

      //Sort data by descending rate and keep only the first five categories.
      group.data = group.statistics.values;

      //Define chart.
      group.chart = createChart(chartContainer, group.chartSettings);
      group.chart.on('init', onInit);
      group.chart.on('resize', onResize);

      if (group.data.length) group.chart.init(group.data);
      else {
        d3select(chartContainer)
          .append('p')
          .text(
            `${chartSettings.group_col}: ${group.chartSettings
              .group_val} (n=${group.chartSettings.n})`
          );

        d3select(chartContainer)
          .append('div')
          .html(`<em>No data available for this level.</em>.<br><br>`);
      }
    });
  } else {
    //Define chart.
    const chart = createChart(chartContainer, chartSettings);
    chart.on('init', onInit);
    chart.on('resize', onResize);
    chart.init(chartData);
  }
}
