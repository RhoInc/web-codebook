var webcodebook = function () {
    'use strict';

    /*------------------------------------------------------------------------------------------------\
      Initialize codebook
    \------------------------------------------------------------------------------------------------*/

    function init(data) {
        var settings = this.config;

        //create chart wrapper in specified div
        this.wrap = d3.select(this.element).append('div');
        this.wrap.attr("class", "web-codebook");

        //save raw data
        this.data.raw = data;

        //settings and defaults
        this.util.setDefaults(this);
        this.layout();

        //prepare the data summaries
        this.data.summary = this.data.makeSummary(data);

        //stub a data summary 
        /*
        this.summary_data = [
            {value_col:"sex"},
            {value_col:"race"},
            {value_col:"age"}
        ]
        */

        //draw controls

        //initialize and then draw the codebook
        this.summaryTable.init();
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

    /*------------------------------------------------------------------------------------------------\
    intialize the summary table
    \------------------------------------------------------------------------------------------------*/

    function renderRow(d) {
        var rowWrap = d3.select(this);
        rowWrap.append("div").attr("class", "row-overview").text(d => d.value_col);
        rowWrap.append("div").attr("class", "row-details");
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
                const values = d3.nest().key(d => d).rollup(d => {
                    return {
                        n: d.length,
                        prop: d.length / vector.length };
                }).entries(vector);

                values.forEach(value => {
                    for (var statistic in value.values) {
                        value[statistic] = value.values[statistic];
                    }
                    delete value.values;
                });

                return values;
            },

            continuous: function (vector) {
                const nonMissing = vector.filter(d => !isNaN(+d) && !/^\s*$/.test(d)).map(d => +d).sort();
                const statistics = {};
                statistics.n = nonMissing.length;
                statistics.nMissing = vector.length - statistics.n;
                statistics.mean = d3.mean(nonMissing);
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

