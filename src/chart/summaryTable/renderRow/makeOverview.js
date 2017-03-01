export function makeOverview(d) {
    //const aspect = 1.2;
    const margin =
        {left: 100
        ,right: 25};
    const aspect=3
    if (d.type === 'categorical') {
        //Categorical - Dot plot//
        const data = d.statistics.values
            .sort((a,b) =>
                a.prop_n > b.prop_n ? -2 :
                a.prop_n < b.prop_n ?  2 :
                    a.key < b.key ? -1 : 1)
            .slice(0,5);
        const webChartContainer = d3.select(this).node();
        const webChartSettings =
            {x: {column: 'prop_n'
                ,type: 'linear'
                ,label: ''
                ,format: '%'
                ,domain: [0,1]}
            ,y: {column: 'key'
                ,type: 'ordinal'
                ,label: ''
                ,order: data.map(d => d.key).reverse()}
            ,marks:
                [   {type: 'circle'
                    ,per: ['key']
                    ,summarizeX: 'mean'
                    ,tooltip: '[key]: [n] ([prop_n])'}
                ]
            ,gridlines: 'xy'
            ,resizable:true
            ,aspect:aspect
            ,margin: margin
            };
        const webChart = new webCharts.createChart(webChartContainer,webChartSettings);

            webChart.init(data);

    } else {
        //CONTINUOUS - Histogram//
        const data = d.values;
        data.forEach((d,i) => {
            data[i] = {value: d};
        });
        const webChartContainer = d3.select(this).node();
        spikeHistogram(webChartContainer, {measure: 'value', aspect: aspect})
            .init(data);
    }
}
