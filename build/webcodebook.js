var webcodebook = function () {
    'use strict';

    /*------------------------------------------------------------------------------------------------\
      Initialize codebook
    \------------------------------------------------------------------------------------------------*/

    function init(data) {
        var settings = this.config;

        //create chart wrapper in specified div
        this.wrap = d3.select(this.element).append('div').attr("class", "web-codebook");

        //save raw data
        this.data.raw = data;

        //settings and defaults
        this.util.setDefaults(this);
        this.layout();

        //prepare the data summaries
        this.data.summary = this.data.makeSummary(data);

        //draw controls

        //initialize and then draw the codebook
        // this.summaryTable.init()
        this.summaryTable.draw(this);
    }

    /*------------------------------------------------------------------------------------------------\
      Generate HTML containers.
    \------------------------------------------------------------------------------------------------*/

    function layout() {
        this.controls.wrap = this.wrap.append('div').attr('class', 'controls');
        this.summaryTable.wrap = this.wrap.append('div').attr('class', 'summaryTable');
    }

    function init$1(chart) {}

    const controls = {
        init: init$1
    };

    /*------------------------------------------------------------------------------------------------\
    intialize the summary table
    \------------------------------------------------------------------------------------------------*/

    function init$2(chart) {}

    /*------------------------------------------------------------------------------------------------\
      draw/update the summaryTable
    \------------------------------------------------------------------------------------------------*/

    function draw(chart) {
        console.log(chart);
        //enter/update/exit for variableDivs

        //BIND the newest data
        var varRows = chart.summaryTable.wrap.selectAll("div.variable").data(chart.data.summary, d => d.value_col);

        //ENTER
        varRows.enter().append("div").attr("class", "variable-row");

        //ENTER + Update
        varRows.each(chart.summaryTable.renderRow);

        //EXIT
        varRows.exit().remove();
    }

    /*------------------------------------------------------------------------------------------------\
      destroy the summary table
    \------------------------------------------------------------------------------------------------*/

    function destroy(chart) {}

    function rowDetails(d) {
        console.log(d);
        var wrap = d3.select(this);
        var title = wrap.append("div").html(d => d.value_col + " <span class='small'>" + d.type + "</span>");
        var stats_div = wrap.append("div").attr("class", "stat-row");
        var statNames = Object.keys(d.statistics).filter(f => f != "values");
        var statList = statNames.map(function (stat) {
            return { key: stat, value: d.statistics[stat] };
        });

        var stats = stats_div.selectAll("div").data(statList).enter().append("div").attr('class', "stat");
        stats.append("div").text(d => d.key).attr("class", "label");
        stats.append("div").text(d => d.value).attr("class", "value");
    }

    function renderRow(d) {
        var rowWrap = d3.select(this);
        rowWrap.append("div").attr("class", "row-overview section");
        rowWrap.append("div").attr("class", "row-details section").each(rowDetails);
    }

    const summaryTable = { init: init$2,
        draw: draw,
        destroy: destroy,
        renderRow: renderRow
    };

    function setDefaults(chart) {}

    const util = {
        setDefaults: setDefaults
    };

    function makeSummary(data) {

        function determineType(vector) {
            const numericValues = vector.filter(d => !isNaN(+d) && !/^\s*$/.test(d));

            return numericValues.length === vector.length && numericValues.length > 4 ? 'continuous' : 'categorical';
        }

        const summarize = {

            categorical: function (vector) {
                const statistics = {};
                statistics.N = vector.length;
                const nonMissing = vector.filter(d => !/^\s*$/.test(d) && d !== 'NA');
                statistics.n = nonMissing.length;
                statistics.nMissing = vector.length - statistics.n;
                statistics.values = d3.nest().key(d => d).rollup(d => {
                    return {
                        n: d.length,
                        prop_N: d.length / statistics.N,
                        prop_n: d.length / statistics.n };
                }).entries(nonMissing);

                statistics.values.forEach(value => {
                    for (var statistic in value.values) {
                        value[statistic] = value.values[statistic];
                    }
                    delete value.values;
                });

                return statistics;
            },

            continuous: function (vector) {
                const statistics = {};
                statistics.N = vector.length;
                const nonMissing = vector.filter(d => !isNaN(+d) && !/^\s*$/.test(d)).map(d => +d).sort();
                statistics.n = nonMissing.length;
                statistics.nMissing = vector.length - statistics.n;
                statistics.mean = d3.mean(nonMissing);
                statistics.SD = d3.deviation(nonMissing);
                const quantiles = [['min', 0], ['5th percentile', .05], ['1st quartile', .25], ['median', .5], ['3rd quartile', .75], ['95th percentile', .95], ['max', 1]];
                quantiles.forEach(quantile => {
                    let statistic = quantile[0];
                    statistics[statistic] = d3.quantile(nonMissing, quantile[1]);
                });

                return statistics;
            }

        };

        const variables = Object.keys(data[0]);

        variables.forEach((variable, i) => {
            variables[i] = { value_col: variable };
            variables[i].values = data.map(d => d[variable]).sort();
            variables[i].type = determineType(variables[i].values);

            if (variables[i].type === 'categorical') variables[i].statistics = summarize.categorical(variables[i].values);else variables[i].statistics = summarize.continuous(variables[i].values);
        });

        return variables;
    }

    const data = {
        makeSummary: makeSummary
    };

    function createChart(element = 'body', config) {
        let chart = { element: element,
            config: config,
            init: init,
            layout: layout,
            controls: controls,
            summaryTable: summaryTable,
            data: data,
            util: util };

        return chart;
    }

    var index = {
        createChart
    };

    return index;
}();

