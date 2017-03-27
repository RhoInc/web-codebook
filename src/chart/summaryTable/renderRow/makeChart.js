import { createHistogram } from '../../../createHistogram.js'

export default function makeChart(d, group) {
  //Common chart settings
    const margin = {};
    const height = 100;

    if (d.type === 'categorical') { // categorical outcomes
        console.log(d)
        const chartContainer = d3.select(this).node();
        const chartSettings =
            {x: {column: 'prop_n'
                ,type: 'linear'
                ,label: ''
                ,format: '%'
                ,domain: [0,null]}
            ,y: {column: 'key'
                ,type: 'ordinal'
                ,label: ''}
            ,marks:
                [   {type: 'text'
                    ,text:"|"
                    ,attributes:{"font-weight":'bold', "alignment-baseline":"middle"}
                    ,per: ['key']
                    ,summarizeX: 'mean'
                    ,tooltip: '[key]: [n] ([prop_n])'}
                ]
            ,gridlines: 'xy'
            ,resizable: false
            ,height: height
            ,margin: margin
            };
        const chartData = d.statistics.values
            .sort((a,b) =>
                a.prop_n > b.prop_n ? -2 :
                a.prop_n < b.prop_n ?  2 :
                    a.key < b.key ? -1 : 1)
            .slice(0,5);
        chartSettings.y.order = chartData.map(d => d.key).reverse();
        console.log(d)
        if (d.groups) {
          chartData.forEach(di => di.group = 'All');

            d.groups.forEach(group => {
                group.statistics.values
                    .filter(value => chartSettings.y.order.indexOf(value.key) > -1)
                    .sort((a,b) =>
                        a.prop_n > b.prop_n ? -2 :
                        a.prop_n < b.prop_n ?  2 :
                            a.key < b.key ? -1 : 1)
                    .forEach(value => {
                        value.group = group.group;
                        chartData.push(value);
                    });
            });
            console.log(chartData)
            chartSettings.marks[0].per.push('group');
            chartSettings.marks[0].values = {'group': ['All']};
            chartSettings.marks.push(
                {type: 'circle'
                ,per: ['key', 'group']
                ,summarizeX: 'mean'
                ,radius: 3
                ,values: {'group': d.groups.map(d => d.group)}});
            chartSettings.color_by = 'group';
            chartSettings.legend =
              {label: ''
                ,order: d.groups.map(d => d.group)
                ,mark:"circle"
              };
              console.log(d.groups.map(d => d.group))
        }

        const chart = webCharts.createChart(chartContainer, chartSettings);
        chart.on("resize",function(){
          var allLegend = this.wrap.select("ul.legend").select("li")
          allLegend.select("svg").remove()
          allLegend.select("span.legend-mark-text")
          .text("|")
          .style("color","black")
          .style("font-weight","bolder")
        })
        chart.init(chartData);
    } else { // continuous outcomes
        const chartContainer = d3.select(this).node();
        const chartSettings =
            {measure: ' '
            ,resizable: false
            ,height: 100
            ,margin: margin};
        let chartData = [];

        if (d.groups) {
            chartSettings.panel = 'group';
            d.groups.forEach(group => {
                group.values.forEach(value => {
                    chartData.push({group: group.group, ' ': value});
                });
            });
        } else {
            d.values.forEach(d => {
                chartData.push({' ': d});
            });
        }

        const chart = createHistogram(chartContainer, chartSettings);
        chart.init(chartData);
    }
}
