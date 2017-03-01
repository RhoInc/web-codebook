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
        this.util.makeAutomaticGroups(this);
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
        chart.controls.groups.init(chart);
        chart.controls.filters.init(chart);
    }

    /*------------------------------------------------------------------------------------------------\
      Initialize custom controls.
    \------------------------------------------------------------------------------------------------*/

    //export function init(selector, data, vars, settings) {
    function init$2(chart) {
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

    /*------------------------------------------------------------------------------------------------\
      Initialize group controls.
    \------------------------------------------------------------------------------------------------*/

    function init$3(chart) {
        if (chart.config.groups.length > 0) {
            var selector = chart.controls.wrap.append('div').attr('class', 'group-select');

            selector.append("span").text("Group by");

            var groupSelect = selector.append("select");

            var groupLevels = d3.merge([["None"], chart.config.groups.map(function (m) {
                return m.value_col;
            })]);

            groupSelect.selectAll("option").data(groupLevels).enter().append("option").text(function (d) {
                return d;
            });

            groupSelect.on("change", function () {
                chart.data.filtered = chart.data.makeFiltered(chart.data.raw, chart.config.filters);
                chart.data.summary = chart.data.filtered.length > 0 ? chart.data.makeSummary(chart.data.filtered, this.value !== 'None' ? this.value : null) : [];
                chart.summaryTable.draw(chart);
            });
        }
    }

    var groups = { init: init$3 };

    var controls = {
        init: init$1,
        filters: filters,
        groups: groups
    };

    /*------------------------------------------------------------------------------------------------\
    intialize the summary table
    \------------------------------------------------------------------------------------------------*/

    function init$4(chart) {}

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

    function makeHeader(d) {
        var wrap = d3.select(this);

        var title = wrap.append('div').html(function (d) {
            return d.value_col;
        });

        //add a short summary
        var summary_text = d.type == 'categorical' ? ' ' + d.type + ' variable with ' + d.statistics.values.length + ' levels' : ' ' + d.type + ' variable';
        var summary_text_span = title.append('span').attr('class', 'small').text(summary_text);

        if (d.type == 'categorical') {
            var value_list = d.statistics.values.map(function (m) {
                return m.key + ': ' + d3.format('0.1%')(m.prop_n);
            });
            var nValues = value_list.length;
            value_list = value_list.slice(0, 10).join('\n');
            value_list = nValues > 10 ? value_list + '\nAnd ' + (nValues - 10) + ' more.' : value_list;

            summary_text_span.append('sup').html('?').style('cursor', 'pointer').attr('title', value_list);
        }
    }

    function makeChart(d, group) {
        //Common chart settings
        var margin = { left: 155,
            right: 30 };
        var height = 100;

        if (d.type === 'categorical') {
            // categorical outcomes
            var chartContainer = d3.select(this).node();
            var chartSettings = { x: { column: 'prop_n',
                    type: 'linear',
                    label: '',
                    format: '%',
                    domain: [0, null] },
                y: { column: 'key',
                    type: 'ordinal',
                    label: '' },
                marks: [{ type: 'circle',
                    per: ['key'],
                    summarizeX: 'mean',
                    tooltip: '[key]: [n] ([prop_n])' }],
                gridlines: 'xy',
                resizable: false,
                height: height,
                margin: margin
            };
            var chartData = d.statistics.values.sort(function (a, b) {
                return a.prop_n > b.prop_n ? -2 : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1;
            }).slice(0, 5);
            chartSettings.y.order = chartData.map(function (d) {
                return d.key;
            }).reverse();

            if (d.groups) {
                chartData.forEach(function (di) {
                    return di.group = 'All';
                });

                d.groups.forEach(function (group) {
                    group.statistics.values.filter(function (value) {
                        return chartSettings.y.order.indexOf(value.key) > -1;
                    }).sort(function (a, b) {
                        return a.prop_n > b.prop_n ? -2 : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1;
                    }).forEach(function (value) {
                        value.group = group.group;
                        chartData.push(value);
                    });
                });

                chartSettings.marks[0].per.push('group');
                chartSettings.marks[0].values = { 'group': ['All'] };
                chartSettings.marks[0].radius = 5;
                chartSettings.marks.push({ type: 'circle',
                    per: ['key', 'group'],
                    summarizeX: 'mean',
                    radius: 3,
                    values: { 'group': d.groups.map(function (d) {
                            return d.group;
                        }) } });
                chartSettings.color_by = 'group';
                chartSettings.legend = { label: '',
                    order: ['All'].concat(d.groups.map(function (d) {
                        return d.group;
                    })) };
            }

            var chart = webCharts.createChart(chartContainer, chartSettings);
            chart.init(chartData);
        } else {
            // continuous outcomes
            var _chartContainer = d3.select(this).node();
            var _chartSettings = { measure: ' ',
                resizable: false,
                height: 100,
                margin: margin };
            var _chartData = [];

            if (d.groups) {
                _chartSettings.panel = 'group';
                d.groups.forEach(function (group) {
                    group.values.forEach(function (value) {
                        _chartData.push({ group: group.group, ' ': value });
                    });
                });
            } else {
                d.values.forEach(function (d) {
                    _chartData.push({ ' ': d });
                });
            }

            var _chart = spikeHistogram(_chartContainer, _chartSettings);
            _chart.init(_chartData);
        }
    }

    function makeDetails(d) {
        var wrap = d3.select(this);

        //Render Summary Stats
        var stats_div = wrap.append('div').attr('class', 'stat-row');
        var statNames = Object.keys(d.statistics).filter(function (f) {
            return f != 'values';
        });
        var statList = statNames.map(function (stat) {
            return {
                key: stat !== 'nMissing' ? stat : 'Missing',
                value: d.statistics[stat] };
        }).filter(function (statItem) {
            return ['N', 'n'].indexOf(statItem.key) === -1;
        });

        //Render Values 
        if (d.type == 'categorical') {
            var stats = stats_div.selectAll('div').data(statList).enter().append('div').attr('class', 'stat');
            stats.append('div').text(function (d) {
                return d.key;
            }).attr('class', 'label');
            stats.append('div').text(function (d) {
                return d.value;
            }).attr('class', 'value');
        } else if (d.type === 'continuous') {
            var stats = stats_div.selectAll('div').data(statList.filter(function (statItem) {
                return statItem.key.indexOf('ile') === -1;
            })).enter().append('div').attr('class', 'stat');
            stats.append('div').text(function (d) {
                return d.key;
            }).attr('class', 'label');
            stats.append('div').text(function (d) {
                return d.value;
            }).attr('class', 'value');
        }
    }

    /*------------------------------------------------------------------------------------------------\
      Intialize the summary table
    \------------------------------------------------------------------------------------------------*/

    function renderRow(d) {
        var rowWrap = d3.select(this);
        rowWrap.selectAll('*').remove();

        rowWrap.append('div').attr('class', 'row-header section').each(makeHeader);
        rowWrap.append('div').attr('class', 'row-chart section').each(makeChart);
        rowWrap.append('div').attr('class', 'row-details section').each(makeDetails);
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

    var summaryTable = { init: init$4,
        draw: draw,
        destroy: destroy,
        renderRow: renderRow,
        updateSummaryText: updateSummaryText
    };

    var defaultSettings = {
        filters: [],
        groups: [],
        autogroups: 5, //automatically include categorical vars with 2-5 levels in the groups dropdown
        autofilter: 10 };

    function setDefaults(chart) {

        /********************* Filter Settings *********************/
        chart.config.filters = chart.config.filters || defaultSettings.filters;

        //autofilter - don't use automatic filter if user specifies filters object
        chart.config.autofilter = chart.config.filters.length > 0 ? false : chart.config.autofilter == null ? defaultSettings.autofilter : chart.config.autofilter;

        /********************* Group Settings *********************/
        chart.config.groups = chart.config.groups || defaultSettings.groups;

        //autogroups - don't use automatic groups if user specifies groups object
        chart.config.autogroups = chart.config.groups.length > 0 ? false : chart.config.autogroups == null ? defaultSettings.autogroups : chart.config.autogroups;
    }

    function makeAutomaticFilters(chart) {
        //make filters for all categorical variables with less than autofilter levels
        if (chart.config.autofilter > 1) {
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

    function makeAutomaticGroups(chart) {
        //make groups for all categorical variables with less than autofilter levels
        if (chart.config.autogroups > 1) {
            var autogroups = chart.data.summary.filter(function (f) {
                return f.type == "categorical";
            }) //categorical filters only
            .filter(function (f) {
                return f.statistics.values.length <= chart.config.autogroups;
            }) //no groups
            .filter(function (f) {
                return f.statistics.values.length > 1;
            }) //no silly 1 item groups 
            .map(function (m) {
                return { value_col: m.value_col };
            });

            chart.config.groups = autogroups.length > 0 ? autogroups : null;
        }
    }

    var util = {
        setDefaults: setDefaults,
        makeAutomaticFilters: makeAutomaticFilters,
        makeAutomaticGroups: makeAutomaticGroups
    };

    function makeSummary(data, group) {

        function determineType(vector) {
            var nonMissingValues = vector.filter(function (d) {
                return !/^\s*$/.test(d);
            });
            var numericValues = nonMissingValues.filter(function (d) {
                return !isNaN(+d);
            });
            var distinctValues = d3.set(numericValues).values();

            return nonMissingValues.length === numericValues.length && distinctValues.length > 10 ? 'continuous' : 'categorical';
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
                }).sort(function (a, b) {
                    return a - b;
                });
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
            //Define variable metadata and generate data array.
            variables[i] = { value_col: variable };
            variables[i].values = data.map(function (d) {
                return d[variable];
            });
            variables[i].type = determineType(variables[i].values);

            //Calculate statistics.
            if (variables[i].type === 'categorical') variables[i].statistics = summarize.categorical(variables[i].values);else variables[i].statistics = summarize.continuous(variables[i].values);

            //Handle groups.
            if (group) {
                variables[i].group = group;
                variables[i].groups = d3.set(data.map(function (d) {
                    return d[group];
                })).values().map(function (g) {
                    return { group: g };
                });

                variables[i].groups.forEach(function (g) {
                    //Define variable metadata and generate data array.
                    g.value_col = variables[i].value_col;
                    g.values = data.filter(function (d) {
                        return d[group] === g.group;
                    }).map(function (d) {
                        return d[variable];
                    });
                    g.type = variables[i].type;

                    //Calculate statistics.
                    if (variables[i].type === 'categorical') g.statistics = summarize.categorical(g.values);else g.statistics = summarize.continuous(g.values);
                });
            }
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

    function init$5() {
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

    function init$6(explorer) {
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
            explorer.makeCodebook(current_obj);
        });
    }

    var controls$1 = {
        init: init$6
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
            init: init$5,
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

