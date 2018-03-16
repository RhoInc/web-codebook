import clone from '../../util/clone';
import onResize from './onResize';
import { createChart } from 'webcharts';
import {
  extent as d3extent,
  nest as d3nest,
  max as d3max,
  set as d3set
} from 'd3';

export default function onInit() {
  const context = this;
  const config = this.initialSettings;
  const measure = config.measure;
  const panel = config.panel;

  //Add a label
  if (this.group) {
    const groupTitle = this.wrap
      .append('p')
      .attr('class', 'panel-label')
      .style('margin-left', context.config.margin.left + 'px')
      .html(
        `${this.config.group_col}: <strong>${this.group}</strong> (n=${
          this.raw_data.length
        })`
      );
    this.wrap
      .node()
      .parentNode.insertBefore(groupTitle.node(), this.wrap.node());
  }

  //Remove non-numeric and missing values.
  if (!this.group) {
    this.initialSettings.unfilteredData = this.raw_data;
    this.raw_data = this.initialSettings.unfilteredData.filter(
      d => !isNaN(+d[measure]) && !/^\s*$/.test(d[measure])
    );
  }

  //Create array of values.
  this.values = this.raw_data.map(d => +d[measure]).sort((a, b) => a - b);

  //Define x-axis domain as the range of the measure, regardless of subgrouping.
  if (!this.initialSettings.xDomain) {
    this.initialSettings.xDomain = d3extent(this.values);
  }
  this.config.x.domain = this.initialSettings.xDomain;

  /**-------------------------------------------------------------------------------------------\
      Paneling
    \-------------------------------------------------------------------------------------------**/

  if (panel && !this.group) {
    //Nest data by paneling variable to efine y-axis domain as the maximum number of observations
    //in a single bin within a subgrouping.
    let max = 0;
    if (!config.y.domain[1]) {
      const nestedData = d3nest()
        .key(d => d[panel])
        .entries(context.raw_data);
      nestedData.forEach(group => {
        const domain = d3extent(group.values, d => +d[measure]);
        const binWidth = (domain[1] - domain[0]) / config.nBins;
        group.values.forEach(d => {
          d.bin =
            Math.floor((+d[measure] - domain[0]) / binWidth) -
            (+d[measure] === domain[1]) * 1;
        });
        const bins = d3nest()
          .key(d => d.bin)
          .rollup(d => d.length)
          .entries(group.values);
        max = Math.max(max, d3max(bins, d => d.values));
      });
    }

    //Plot the chart for each group.
    const groups = d3set(context.raw_data.map(d => d[panel]))
      .values()
      .map(d => {
        return { group: d };
      })
      .sort((a, b) => (a.group < b.group ? -1 : 1));

    groups.forEach((group, i) => {
      group.settings = clone(config);
      group.settings.y.label = group.group;
      group.settings.y.domain = config.commonScale ? [0, max] : [0, null];
      group.data = context.raw_data.filter(d => d[panel] === group.group);
      group.settings.xDomain = config.commonScale
        ? config.xDomain
        : d3extent(group.data, d => +d[measure]);
      group.settings.x.domain = group.settings.xDomain;
      group.webChart = new createChart(config.container, group.settings);
      group.webChart.initialSettings = group.settings;
      group.webChart.group = group.group;
      group.webChart.on('init', onInit);
      group.webChart.on('resize', onResize);
      group.webChart.init(group.data);
    });
  }
}
