import { defineHistogram } from './histogramBoxPlot/defineHistogram';
import { select as d3select } from 'd3';

export function createHistogramBoxPlot(this_, d) {
    const chartContainer = d3select(this_).node();
    const chartSettings = {
        measure: ' ',
        resizable: false,
        height: 100,
        margin: this_.margin,
        nBins: d.bins,
        chartType: d.chartType,
        commonScale: d.commonScale == undefined ? true : d.commonScale
    };
    let chartData = [];

    if (d.groups) {
        chartSettings.panel = 'group';
        chartSettings.group_col = d.group;
        chartSettings.group_label = d.groupLabel;
        d.groups.forEach(group => {
            group.values.forEach(value => {
                chartData.push({
                    group: group.group || '<no value>',
                    ' ': value.value,
                    index: value.index,
                    highlighted: value.highlighted
                });
            });
        });
    } else {
        d.values.forEach(d => {
            chartData.push({
                ' ': d.value,
                index: d.index,
                highlighted: d.highlighted
            });
        });
    }

    const chart = defineHistogram(chartContainer, chartSettings);
    chart.init(chartData);
}
