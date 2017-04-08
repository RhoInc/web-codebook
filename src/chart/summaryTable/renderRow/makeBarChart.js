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
    //Sort data by descending rate and keep only the first five categories.
    const chartData = d.statistics.values
        .sort((a,b) =>
            a.prop_n > b.prop_n ? -2 :
            a.prop_n < b.prop_n ?  2 :
                a.key < b.key ? -1 : 1)
        .slice(0,5);
    chartSettings.y.order = chartData.map(d => d.key).reverse();

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
        this.current_data
            .forEach(d => {
                const overall = this.config.group
                    ? this.config.overall
                        .filter(di => di.key === d.key)[0]
                    : this.raw_data.filter(di => di.key === d.key)[0];

                if (overall) {
                    const g = this.svg.append('g');
                    const x = overall.prop_n;
                    const y = overall.key;

                  //Draw vertical line representing the overall rate of the y-axis value.
                    const rateLine = g
                        .append('line')
                        .attr(
                            {'x1': this.x(x)
                            ,'y1': this.y(y)
                            ,'x2': this.x(x)
                            ,'y2': this.y(y) + this.y.rangeBand()})
                        .style(
                            {'stroke': 'black'
                            ,'stroke-width': '2px'
                            ,'stroke-opacity': '1'});
                    rateLine
                        .append('title')
                        .text(`Overall rate: ${d3.format('.1%')(x)}`);

                  //Draw line from group rate to overall rate of the y-axis value.
                    if (this.config.group) {
                        const diffLine = g
                            .append('line')
                            .attr(
                                {'class': 'diffFromTotal'
                                ,'x1': this.x(x)
                                ,'y1': this.y(y) + this.y.rangeBand()/2
                                ,'x2': this.x(d.total)
                                ,'y2': this.y(y) + this.y.rangeBand()/2})
                            .style(
                                {'display': 'none'
                                ,'stroke': 'black'
                                ,'stroke-width': '2px'
                                ,'stroke-opacity': '.25'});
                        diffLine
                            .append('title')
                            .text(`Difference from overall rate: ${d3.format('.1f')((d.total - x)*100)}`);
                        const diffText = g
                            .append('text')
                            .attr(
                                {'class': 'diffFromTotal'
                                ,'x': this.x(x)
                                ,'y': this.y(y) + this.y.rangeBand()/2
                                ,'dx': x < d.total ? '-2px' : '5px'
                                ,'text-anchor': x < d.total ? 'end' : 'beginning'})
                            .style(
                                {'display': 'none'})
                            .text(`${x < d.total ? '-' : x > d.total ? '+' : ''}${d3.format('.1f')(Math.abs(d.total - x)*100)}`);
                    }
                }

              //Display difference from total on hover.
                if (this.config.group)
                    this.svg
                        .on('mouseover', () => {
                            this.svg.selectAll('.diffFromTotal')
                                .style('display', 'block')
                            this.svg.selectAll('text.diffFromTotal')
                                .each(function() {
                                    d3.select(this)
                                        .attr('dy', this.getBBox().height/4);
                                });
                        })
                        .on('mouseout', () =>
                            this.svg.selectAll('.diffFromTotal')
                                .style('display', 'none'));
            });
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
                .filter(di => chartSettings.y.order.indexOf(di.key) > -1)
                .sort((a,b) =>
                    a.prop_n > b.prop_n ? -2 :
                    a.prop_n < b.prop_n ?  2 :
                        a.key < b.key ? -1 : 1)
                .slice(0,5);

          //Define chart.
            group.chart = webCharts.createChart(chartContainer, group.chartSettings);
            group.chart.on('init', onInit);
            group.chart.on('resize', onResize);
            if (group.data.length)
                group.chart.init(group.data);
            else {
                d3.select(chartContainer)
                    .append('p')
                    .text(`${chartSettings.group_col}: ${group.chartSettings.group} (n=${group.chartSettings.n})`);
                d3.select(chartContainer)
                    .append('div')
                    .html(`<em>This group does not contain any of the first 5 most prevalent levels of ${d.value_col}</em>.<br><br>`);
            }
        });
    } else {
      //Define chart.
        const chart = webCharts.createChart(chartContainer, chartSettings);
        chart.on('init', onInit);
        chart.on('resize', onResize);
        chart.init(chartData);
    }
}
