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
        this.util.makeAutomaticFilters(this);
        this.controls.init(this);

        //initialize and then draw the codebook
        this.summaryTable.draw(this);
    }

    /*------------------------------------------------------------------------------------------------\
      Generate HTML containers.
    \------------------------------------------------------------------------------------------------*/

    function layout() {
        this.controls.wrap = this.wrap.append('div').attr('class', 'controls');

        this.summaryTable.wrap = this.wrap.append('div').attr('class', 'summaryTable');

        this.summaryTable.summaryText = this.summaryTable.wrap.append("strong").attr("class", "summaryText");
    }

    function init$1(chart) {
        chart.controls.wrap.attr('onsubmit', 'return false;');
        chart.controls.wrap.selectAll('*').remove(); //Clear controls.

        //Draw filters
        chart.controls.filters.init(chart);
    }

    /*------------------------------------------------------------------------------------------------\
      Initialize custom controls.
    \------------------------------------------------------------------------------------------------*/

    //export function init(selector, data, vars, settings) {
    function init$2(chart) {
        console.log(chart);
        console.log(chart.config);

        //initialize the wrapper
        var selector = chart.controls.wrap.append('div').attr('class', 'custom-filters');

        //add a list of values to each filter object
        chart.config.filters.forEach(function (e) {
            e.values = d3.nest().key(function (d) {
                return d[e.value_col];
            }).entries(chart.data.raw).map(function (d) {
                return { "value": d.key, "selected": true };
            });
        });

        //Clear custom controls.
        selector.selectAll('ul.nav').remove();

        //Add filter controls.
        var filterList = selector.append('ul').attr('class', 'nav');

        var filterItem = filterList.selectAll('li').data(chart.config.filters).enter().append('li').attr('class', function (d) {
            return 'custom-' + d.key + ' filterCustom';
        });

        var filterLabel = filterItem.append('span').attr('class', 'filterLabel');

        filterLabel.append("span").html(function (d) {
            return d.label || d.value_col;
        });

        var filterCustom = filterItem.append('select').attr('multiple', true);

        //Add data-driven filter options.
        var filterItems = filterCustom.selectAll('option').data(function (d) {
            return d.values;
        }).enter().append('option').html(function (d) {
            return d.value;
        }).attr('value', function (d) {
            return d.value;
        }).attr('selected', function (d) {
            return d.selected ? 'selected' : null;
        });

        //Initialize event listeners
        filterCustom.on('change', function () {
            // flag the selected options in the config
            d3.select(this).selectAll('option').each(function (option_d) {
                option_d.selected = d3.select(this).property('selected');
            });

            //update the chart
            chart.data.filtered = chart.data.makeFiltered(chart.data.raw, chart.config.filters);
            chart.data.summary = chart.data.filtered.length > 0 ? chart.data.makeSummary(chart.data.filtered) : [];
            chart.summaryTable.draw(chart);
        });
    }

    var filters = { init: init$2 };

    var controls = {
        init: init$1,
        filters: filters
    };

    /*------------------------------------------------------------------------------------------------\
    intialize the summary table
    \------------------------------------------------------------------------------------------------*/

    function init$3(chart) {}

    /*------------------------------------------------------------------------------------------------\
      draw/update the summaryTable
    \------------------------------------------------------------------------------------------------*/

    function draw(chart) {
        //update Summary Text
        chart.summaryTable.updateSummaryText(chart);

        //enter/update/exit for variableDivs
        //BIND the newest data
        var varRows = chart.summaryTable.wrap.selectAll("div.variable-row").data(chart.data.summary, function (d) {
            return d.value_col;
        });

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

    function makeOverview(d) {
        //const aspect = 1.2;
        var margin = { left: 100,
            right: 25 };
        var aspect = 3;
        if (d.type === 'categorical') {
            //Categorical - Dot plot//
            var data = d.statistics.values.sort(function (a, b) {
                return a.prop_n > b.prop_n ? -2 : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1;
            }).slice(0, 5);
            var webChartContainer = d3.select(this).node();
            var webChartSettings = { x: { column: 'prop_n',
                    type: 'linear',
                    label: '',
                    format: '%',
                    domain: [0, 1] },
                y: { column: 'key',
                    type: 'ordinal',
                    label: '',
                    order: data.map(function (d) {
                        return d.key;
                    }).reverse() },
                marks: [{ type: 'circle',
                    per: ['key'],
                    summarizeX: 'mean',
                    tooltip: '[key]: [n] ([prop_n])' }],
                gridlines: 'xy',
                resizable: true,
                aspect: aspect,
                margin: margin
            };
            var webChart = new webCharts.createChart(webChartContainer, webChartSettings);

            webChart.init(data);
        } else {
            //CONTINUOUS - Histogram//
            var _data = d.values;
            _data.forEach(function (d, i) {
                _data[i] = { value: d };
            });
            var _webChartContainer = d3.select(this).node();
            var _webChartSettings = { x: { column: 'value',
                    type: 'linear',
                    label: '',
                    bin: 25 },
                y: { column: 'value',
                    type: 'linear',
                    label: '',
                    domain: [0, null] },
                marks: [{ type: 'bar',
                    per: ['value'],
                    summarizeX: 'mean',
                    summarizeY: 'count' }],
                gridlines: 'y',
                resizable: true,
                aspect: aspect,
                margin: margin
            };
            var _webChart = new webCharts.createChart(_webChartContainer, _webChartSettings);

            _webChart.init(_data);
        }
    }

    function makeDetails(d) {
        var wrap = d3.select(this);

        var title = wrap.append("div").html(function (d) {
            return d.value_col;
        });

        //add a short summary
        var summary_text = d.type == "categorical" ? " " + d.type + " variable with " + d.statistics.values.length + " levels" : " " + d.type + " variable";
        var summary_text_span = title.append("span").attr("class", "small").text(summary_text);

        if (d.type == "categorical") {
            var value_list = d.statistics.values.map(function (m) {
                return m.key + ": " + d3.format("0.1%")(m.prop_n);
            });
            var nValues = value_list.length;
            value_list = value_list.slice(0, 10).join("\n");
            value_list = value_list.length > 10 ? value_list + "\nAnd " + (nValues - 10) + " more." : value_list;

            summary_text_span.append("sup").html("?").style("cursor", "pointer").attr("title", value_list);
        }

        //Render Summary Stats
        var stats_div = wrap.append("div").attr("class", "stat-row");
        var statNames = Object.keys(d.statistics).filter(function (f) {
            return f != "values";
        });
        var statList = statNames.map(function (stat) {
            return { key: stat, value: d.statistics[stat] };
        });

        var stats = stats_div.selectAll("div").data(statList).enter().append("div").attr('class', "stat");
        stats.append("div").text(function (d) {
            return d.key;
        }).attr("class", "label");
        stats.append("div").text(function (d) {
            return d.value;
        }).attr("class", "value");

        //Render Values 

        if (d.type == "categorical") {
            //value table for categorical

        } else if (d.type == "continuous") {
            //min/maxes for continuous

        }
    }

    /*------------------------------------------------------------------------------------------------\
    intialize the summary table
    \------------------------------------------------------------------------------------------------*/

    function renderRow(d) {
        var rowWrap = d3.select(this);
        rowWrap.selectAll("*").remove();
        rowWrap.append("div").attr("class", "row-overview section").each(makeOverview);
        rowWrap.append("div").attr("class", "row-details section").each(makeDetails);
    }

    function updateSummaryText(chart) {
        //Chart Summary Span
        if (chart.data.summary.length > 0) {
            var nCols = chart.data.summary.length;
            var nShown = chart.data.summary[0].statistics.N;
            var nTot = chart.data.raw.length;
            var percent = d3.format('0.1%')(nShown / nTot);
            var tableSummary = "Data summary for " + nCols + " columns and " + nShown + " of " + nTot + " (" + percent + ") rows shown below.";
        } else {
            tableSummary = "No values selected. Update the filters above or load a different data set.";
        }

        chart.summaryTable.summaryText.text(tableSummary);
    }

    var summaryTable = { init: init$3,
        draw: draw,
        destroy: destroy,
        renderRow: renderRow,
        updateSummaryText: updateSummaryText
    };

    var defaultSettings = {
        filters: [],
        autofilter: 10
    };

    function setDefaults(chart) {

        chart.config.filters = chart.config.filters || defaultSettings.filters;

        //autofilter - don't use automatic filter if user specifies filters object
        chart.config.autofilter = chart.config.filters.length > 0 ? false : chart.config.autofilter == null ? defaultSettings.autofilter : chart.config.autofilter;
    }

    function makeAutomaticFilters(chart) {
        //make filters for all categorical variables with less than
        if (chart.config.autofilter > 0) {
            console.log(chart.data.summary);
            var autofilters = chart.data.summary.filter(function (f) {
                return f.type == "categorical";
            }) //categorical filters only
            .filter(function (f) {
                return f.statistics.values.length <= chart.config.autofilter;
            }) //no huge filters
            .filter(function (f) {
                return f.statistics.values.length > 1;
            }) //no silly 1 item filters 
            .map(function (m) {
                return { value_col: m.value_col };
            });

            chart.config.filters = autofilters.length > 0 ? autofilters : null;
        }
    }

    var util = {
        setDefaults: setDefaults,
        makeAutomaticFilters: makeAutomaticFilters

    };

    function makeSummary(data) {

        function determineType(vector) {
            var numericValues = vector.filter(function (d) {
                return !isNaN(+d) && !/^\s*$/.test(d);
            });

            return numericValues.length === vector.length && numericValues.length > 4 ? 'continuous' : 'categorical';
        }

        var summarize = {

            categorical: function categorical(vector) {
                var statistics = {};
                statistics.N = vector.length;
                var nonMissing = vector.filter(function (d) {
                    return !/^\s*$/.test(d) && d !== 'NA';
                });
                statistics.n = nonMissing.length;
                statistics.nMissing = vector.length - statistics.n;
                statistics.values = d3.nest().key(function (d) {
                    return d;
                }).rollup(function (d) {
                    return {
                        n: d.length,
                        prop_N: d.length / statistics.N,
                        prop_n: d.length / statistics.n };
                }).entries(nonMissing);

                statistics.values.forEach(function (value) {
                    for (var statistic in value.values) {
                        value[statistic] = value.values[statistic];
                    }
                    delete value.values;
                });

                return statistics;
            },

            continuous: function continuous(vector) {
                var statistics = {};
                statistics.N = vector.length;
                var nonMissing = vector.filter(function (d) {
                    return !isNaN(+d) && !/^\s*$/.test(d);
                }).map(function (d) {
                    return +d;
                }).sort();
                statistics.n = nonMissing.length;
                statistics.nMissing = vector.length - statistics.n;
                statistics.mean = d3.format('0.2f')(d3.mean(nonMissing));
                statistics.SD = d3.format('0.2f')(d3.deviation(nonMissing));
                var quantiles = [['min', 0], ['5th percentile', .05], ['1st quartile', .25], ['median', .5], ['3rd quartile', .75], ['95th percentile', .95], ['max', 1]];
                quantiles.forEach(function (quantile) {
                    var statistic = quantile[0];
                    statistics[statistic] = d3.format('0.1f')(d3.quantile(nonMissing, quantile[1]));
                });

                return statistics;
            }

        };

        var variables = Object.keys(data[0]);

        variables.forEach(function (variable, i) {
            variables[i] = { value_col: variable };
            variables[i].values = data.map(function (d) {
                return d[variable];
            }).sort();
            variables[i].type = determineType(variables[i].values);

            if (variables[i].type === 'categorical') variables[i].statistics = summarize.categorical(variables[i].values);else variables[i].statistics = summarize.continuous(variables[i].values);
        });

        return variables;
    }

    function makeFiltered(data, filters) {
        var filtered = data;
        filters.forEach(function (filter_d) {
            //remove the filtered values from the data based on the filters
            filtered = filtered.filter(function (rowData) {
                var currentValues = filter_d.values.filter(function (f) {
                    return f.selected;
                }).map(function (m) {
                    return m.value;
                });
                return currentValues.indexOf(rowData[filter_d.value_col]) > -1;
            });
        });
        return filtered;
    }

    var data = {
        makeSummary: makeSummary,
        makeFiltered: makeFiltered

    };

    function createChart() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
        var config = arguments[1];

        var chart = { element: element,
            config: config,
            init: init,
            layout: layout,
            controls: controls,
            summaryTable: summaryTable,
            data: data,
            util: util };

        return chart;
    }

    /*------------------------------------------------------------------------------------------------\
      Initialize explorer
    \------------------------------------------------------------------------------------------------*/

    function init$4() {
        var settings = this.config;

        //create wrapper in specified div
        this.wrap = d3.select(this.element).append('div').attr("class", "web-codebook-explorer");

        //layout the divs
        this.layout(this);

        //draw controls
        this.controls.init(this);

        //draw first codebook
        this.makeCodebook(this.config.files[0]);
    }

    /*------------------------------------------------------------------------------------------------\
      Generate HTML containers.
    \------------------------------------------------------------------------------------------------*/

    function layout$1() {
        this.controls.wrap = this.wrap.append('div').attr('class', 'controls');

        this.codebookWrap = this.wrap.append('div').attr('class', 'codebookWrap');
    }

    function init$5(explorer) {
        explorer.controls.wrap.attr('onsubmit', 'return false;');
        explorer.controls.wrap.selectAll('*').remove(); //Clear controls.

        //Make file selector

        var file_select_wrap = explorer.controls.wrap.append("div").style("padding", ".5em").style("border-bottom", "2px solid black");

        file_select_wrap.append("span").text("Pick a file: ");

        var select = file_select_wrap.append("select");

        select.selectAll("option").data(explorer.config.files).enter().append("option").text(function (d) {
            return d.label;
        });

        select.on("change", function (d) {
            var current_text = this.value;
            var current_obj = explorer.config.files.filter(function (f) {
                return f.label == current_text;
            })[0];
            //console.log(d3.select(this).data())
            explorer.makeCodebook(current_obj);
        });
    }

    var controls$1 = {
        init: init$5
    };

    function makeCodebook(meta) {
        this.codebookWrap.selectAll("*").remove();
        var codebook = webcodebook.createChart('.web-codebook-explorer .codebookWrap', meta.settings);
        d3.csv(meta.path, function (error, data) {
            codebook.init(data);
        });
    }

    function createExplorer() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
        var config = arguments[1];

        var explorer = { element: element,
            config: config,
            init: init$4,
            layout: layout$1,
            controls: controls$1,
            makeCodebook: makeCodebook
        };

        return explorer;
    }

    var index = {
        createChart: createChart,
        createExplorer: createExplorer
    };

    return index;
}();

