import clone from '../util/clone';
import onInit from './horizontalBars/onInit';
import onResize from './horizontalBars/onResize';
import { createChart } from 'webcharts';
import { select as d3select, max as d3max, merge as d3merge } from 'd3';

export function createHorizontalBars(this_, d) {
  const rowSelector = d3select(this_).node().parentNode,
    outcome = d3select(rowSelector)
      .select('.row-controls .x-axis-outcome select')
      .property('value'),
    custom_height = d.statistics.values.length * 20 + 35, // let height vary based on the number of levels; 35 ~= top and bottom margin
    chartContainer = d3select(this_).node(),
    chartSettings = {
      x: {
        column: outcome === 'rate' ? 'prop_n' : 'n',
        type: 'linear',
        label: '',
        format: outcome === 'rate' ? '%' : 'd',
        domain: [0, null]
      },
      y: {
        column: 'key',
        type: 'ordinal',
        label: ''
      },
      marks: [
        {
          type: 'bar',
          per: ['key'],
          tooltip: '[key]: [n] ([prop_n_text])',
          attributes: {
            stroke: null
          }
        }
      ],
      colors: ['#999'],
      gridlines: 'x',
      resizable: false,
      height: custom_height,
      margin: this_.margin,
      value_col: d.value_col,
      group_col: d.group || null,
      group_label: d.groupLabel || null,
      overall: d.statistics.values,
      chartType: d.chartType
    };
  var chartData = d.statistics.values.sort(
    (a, b) =>
      a.prop_n > b.prop_n
        ? -2
        : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1
  ); // sort data by descending rate and keep only the first five categories.

  chartSettings.y.order = chartData.map(d => d.key).reverse();

  //Add highlight values (if any)
  chartData.forEach(function(d) {
    d.type = 'Main';
  });

  if (d.statistics.highlightValues) {
    d.statistics.highlightValues.forEach(function(d) {
      d.type = 'sub';
    });
    chartData = d3merge([chartData, d.statistics.highlightValues]);

    chartSettings.marks[0].per = ['key', 'type'];
    chartSettings.marks[0].arrange = 'nested';
    chartSettings.color_by = 'type';
    chartSettings.colors = ['#999', 'orange'];
  }

  if (d.groups) {
    //Set upper limit of x-axis domain to the maximum group rate.
    chartSettings.x.domain[1] = d3max(d.groups, di =>
      d3max(di.statistics.values, dii => dii[chartSettings.x.column])
    );

    d.groups.forEach(group => {
      //Define group-level settings.
      group.chartSettings = clone(chartSettings);
      group.chartSettings.group_val = group.group;
      group.chartSettings.n = group.values.length;

      //Sort data by descending rate and keep only the first five categories.
      group.data = group.statistics.values
        .filter(di => chartSettings.y.order.indexOf(di.key) > -1)
        .sort(
          (a, b) =>
            a.prop_n > b.prop_n
              ? -2
              : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1
        );

      group.data.forEach(function(d) {
        d.type = 'main';
      });
      if (group.statistics.highlightValues) {
        group.statistics.highlightValues.forEach(function(d) {
          d.type = 'sub';
        });
        group.data = d3merge([group.data, group.statistics.highlightValues]);

        group.chartSettings.marks[0].per = ['key', 'type'];
        group.chartSettings.marks[0].arrange = 'nested';
        group.chartSettings.color_by = 'type';
        group.chartSettings.colors = ['#999', 'orange'];
      }

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
          .html(`<em>All values missing in this group.</em>.<br><br>`);
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
