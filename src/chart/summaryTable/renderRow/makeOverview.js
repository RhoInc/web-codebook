export default function makeOverview() {
    const aspect = 8;
    const margin =
        {left: 250
        ,right: 25};

    if (this.data()[0].type === 'categorical') {

        const data = this.data()[0].statistics.values
            .sort((a,b) =>
                a.prop_n > b.prop_n ? -2 :
                a.prop_n < b.prop_n ?  2 :
                    a.key < b.key ? -1 : 1)
            .slice(0,5);
        const webChartContainer = this.node();
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
            ,aspect: aspect
            ,margin: margin
            };
        const webChart = new webCharts.createChart
            (webChartContainer
            ,webChartSettings);

            webChart.init(data);

    } else {

        const data = this.data()[0].values;
        data.forEach((d,i) => {
            data[i] = {value: d};
        });
        const webChartContainer = this.node();
        const webChartSettings =
            {x: {column: 'value'
                ,type: 'linear'
                ,label: ''
                ,bin: 25}
            ,y: {column: 'value'
                ,type: 'linear'
                ,label: ''
                ,domain: [0,null]}
            ,marks:
                [   {type: 'bar'
                    ,per: ['value']
                    ,summarizeX: 'mean'
                    ,summarizeY: 'count'}
                ]
            ,gridlines: 'y'
            ,aspect: aspect
            ,margin: margin
            };
        const webChart = new webCharts.createChart
            (webChartContainer
            ,webChartSettings);

        webChart.init(data);
    }
}
