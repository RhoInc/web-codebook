import clone from '../../../histogram/util/clone';

export function makeBarChart(this_, d) {
    const chartContainer = d3.select(this_).node();
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
            [
                {type: 'bar'
                ,per: ['key']
                ,summarizeX: 'mean'
                ,tooltip: '[key]: [n] ([prop_n])'}
            ]
        ,gridlines: 'xy'
        ,resizable: false
        ,height: this_.height
        ,margin: this_.margin
        ,value_col: d.value_col
        };

    function onInit() {
      //Add group labels.
        if (this.config.group) {
            const groupTitle = this.wrap
                .append('p')
                .text(`${this.config.group_col}: ${this.config.group} (n=${this.config.n})`);
            this.wrap.node().parentNode
                .insertBefore(groupTitle.node(), this.wrap.node())
        }
    }

    function onResize() {
      //Move y-axis labels to the right.
        const ticks = this.wrap
            .selectAll('g.y.axis g.tick');

        ticks.select('text').remove();
        ticks.append('title')
            .text(d => d);
        ticks
            .append('text')
            .attr(
                {'text-anchor': 'start'
                ,'alignment-baseline': 'middle'
                ,'dx': '1em'
                ,'x': this.plot_width})
            .text(d => d.length < 30
                ? d
                : d.substring(0,30)+'...');

      //Draw overall rates.
        if (this.config.group) {
            this.current_data
                .forEach(d => {
                    const overall = this.config.overall
                        .filter(di => di.key === d.key)[0];

                    if (overall) {
                        const g = this.svg.append('g');
                        const x = overall.prop_n;
                        const y = overall.key;

                      //Draw line representing the overall rate of the y-axis value.
                        const rateLine = g
                            .append('line')
                            .attr(
                                {'x1': this.x(x) + 1.5
                                ,'y1': this.y(y)
                                ,'x2': this.x(x) + 1.5
                                ,'y2': this.y(y) + this.y.rangeBand()})
                            .style(
                                {'stroke': 'black'
                                ,'stroke-width': '3px'
                                ,'stroke-opacity': '1'});
                        rateLine
                            .append('title')
                            .text(`Overall rate: ${d3.format('.1%')(x)}`);

                      //Draw line from group rate to overall rate of the y-axis value.
                        const diffLine = g
                            .append('line')
                            .attr(
                                {'x1': this.x(x)
                                ,'y1': this.y(y) + this.y.rangeBand()/2
                                ,'x2': this.x(d.total)
                                ,'y2': this.y(y) + this.y.rangeBand()/2})
                            .style(
                                {'stroke': 'black'
                                ,'stroke-width': '3px'
                                ,'stroke-opacity': '.25'});
                        diffLine
                            .append('title')
                            .text(`Difference in percentage points from overall rate: ${d3.format('.1f')((d.total - x)*100)}`);
                    }
                });
        }
    }

    if (d.groups) {
        chartSettings.group_col = d.group;
        chartSettings.overall = d.statistics.values;
      //Set upper limit of x-axis domain to the maximum group rate.
        chartSettings.x.domain[1] = d3.max(d.groups,
            di => d3.max(di.statistics.values,
                dii => dii.prop_n));

        d.groups.forEach(group => {
          //Define group-level settings.
            group.chartSettings = clone(chartSettings);
            group.chartSettings.group = group.group;
            group.chartSettings.n = group.values.length;

          //Sort data by descending rate and keep only the first five categories.
            group.data = group.statistics.values
                .sort((a,b) =>
                    a.prop_n > b.prop_n ? -2 :
                    a.prop_n < b.prop_n ?  2 :
                        a.key < b.key ? -1 : 1)
                .slice(0,5);
            group.chartSettings.y.order = group.data.map(d => d.key).reverse();

          //Define chart.
            group.chart = webCharts.createChart(chartContainer, group.chartSettings);
            group.chart.on('init', onInit);
            group.chart.on('resize', onResize);
            if (group.data.length)
                group.chart.init(group.data);
        });
    } else {
      //Sort data by descending rate and keep only the first five categories.
        const chartData = d.statistics.values
            .sort((a,b) =>
                a.prop_n > b.prop_n ? -2 :
                a.prop_n < b.prop_n ?  2 :
                    a.key < b.key ? -1 : 1)
            .slice(0,5);
        chartSettings.y.order = chartData.map(d => d.key).reverse();

      //Define chart.
        const chart = webCharts.createChart(chartContainer, chartSettings);
        chart.on('init', onInit);
        chart.on('resize', onResize);
        chart.init(chartData);
    }
}
