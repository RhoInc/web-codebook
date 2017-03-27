import clone from './util/clone';
import onResize from './onResize';

export default function onInit() {
    const context = this;
    const config = this.initialSettings;
    const measure = config.measure;
    const panel = config.panel;

  //Remove non-numeric and missing values.
    if (!this.group) {
        this.initialSettings.unfilteredData = this.raw_data;
        this.raw_data = this.initialSettings.unfilteredData
            .filter(d =>
                !isNaN(+d[measure]) &&
                !/^\s*$/.test(d[measure]));
    }

  //Create array of values.
    this.values = this.raw_data
        .map(d => +d[measure])
        .sort((a,b) => a-b);

  //Define x-axis domain as the range of the measure, regardless of subgrouping.
    if (!this.initialSettings.xDomain) {
        this.initialSettings.xDomain = d3.extent(this.values);
        config.xDomain = this.initialSettings.xDomain;
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
                const nestedData = d3.nest()
                    .key(d => d[panel])
                    .entries(context.raw_data);
                nestedData.forEach(group => {
                    const domain = d3.extent(group.values, d => +d[measure]);
                    const binWidth = (domain[1] - domain[0])/(config.nBins);
                    group.values
                        .forEach(d => {
                            d.bin = Math.floor((+d[measure] - domain[0])/binWidth) - (+d[measure] === domain[1])*1;
                        });
                    const bins = d3.nest()
                        .key(d => d.bin)
                        .rollup(d => d.length)
                        .entries(group.values);
                    max = Math.max(max, d3.max(bins, d => d.values));
                });
            }

          //Plot the chart for each group.
            const groups = d3.set(
                    context.raw_data
                        .map(d => d[panel]))
                .values()
                .map(d => { return {group: d}; })
                .sort((a,b) => a.group < b.group ? -1 : 1);
            groups
                .forEach((group,i) => {
                    group.settings = clone(config);
                    group.settings.y.label = group.group;
                    group.settings.y.domain = [0,max];
                    group.data = context.raw_data
                        .filter(d => d[panel] === group.group);
                    group.webChart = new webCharts.createChart
                        (config.container
                        ,group.settings);
                    group.webChart.initialSettings = group.settings;
                    group.webChart.group = group.group;
                    group.webChart.on('init', onInit);
                    group.webChart.on('resize', onResize);
                    group.webChart
                        .init(group.data);
                });
        }
}
