var webcodebook = (function (webcharts) {
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
    this.data.filtered = data; //assume no filters active on init :/

    //settings and defaults
    this.util.setDefaults(this);
    this.layout();

    //prepare the data summaries
    this.data.makeSummary(this);

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
    chart.controls.chartToggle.init(chart);
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
        chart.data.makeSummary(chart);
        chart.summaryTable.draw(chart);
    });
}

/*------------------------------------------------------------------------------------------------\
  Define filter controls object.
\------------------------------------------------------------------------------------------------*/

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
            if (this.value !== 'None') chart.config.group = this.value;else delete chart.config.group;
            chart.data.filtered = chart.data.makeFiltered(chart.data.raw, chart.config.filters);
            chart.data.makeSummary(chart);
            chart.summaryTable.draw(chart);
        });
    }
}

/*------------------------------------------------------------------------------------------------\
  Define filter controls object.
\------------------------------------------------------------------------------------------------*/

var groups = { init: init$3 };

/*------------------------------------------------------------------------------------------------\
  Initialize custom controls.
\------------------------------------------------------------------------------------------------*/

//export function init(selector, data, vars, settings) {
function init$4(chart) {
  //initialize the wrapper
  var selector = chart.controls.wrap.append('div').attr('class', 'chart-toggle');

  var showAllButton = selector.append("button").text("Show All Charts").on("click", function () {
    chart.wrap.selectAll(".variable-row").classed("hiddenChart", false);
    chart.wrap.selectAll(".row-toggle").html("&#9660;");
  });

  var hideAllButton = selector.append("button").text("Hide All Charts").on("click", function () {
    chart.wrap.selectAll(".variable-row").classed("hiddenChart", true);
    chart.wrap.selectAll(".row-toggle").html("&#9658;");
  });
}

/*------------------------------------------------------------------------------------------------\
  Define chart toggle object.
\------------------------------------------------------------------------------------------------*/

var chartToggle = { init: init$4 };

/*------------------------------------------------------------------------------------------------\
  Define controls object.
\------------------------------------------------------------------------------------------------*/

var controls = {
  init: init$1,
  filters: filters,
  groups: groups,
  chartToggle: chartToggle
};

/*------------------------------------------------------------------------------------------------\
intialize the summary table
\------------------------------------------------------------------------------------------------*/

function init$5(chart) {}

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
	varRows.enter().append("div").attr("class", function (d) {
		return "variable-row hiddenChart " + d.type;
	});

	//ENTER + Update
	varRows.each(chart.summaryTable.renderRow);

	//EXIT
	varRows.exit().remove();
}

/*------------------------------------------------------------------------------------------------\
  destroy the summary table
\------------------------------------------------------------------------------------------------*/

function destroy(chart) {}

function makeTitle(d) {
	var wrap = d3.select(this);
	var titleDiv = wrap.append('div').attr("class", "var-name");
	var valuesList = wrap.append('ul').attr("class", "value-list");

	//Title and type
	titleDiv.append("div").attr("class", "name").html(function (d) {
		return d.value_col;
	});
	titleDiv.append("div").attr("class", "type").html(function (d) {
		return d.type;
	});

	//make a list of values
	if (d.type == "categorical") {
		//valuesList.append("span").text( "Values (Most Frequent):")
		var topValues = d.statistics.values.sort(function (a, b) {
			return b.n - a.n;
		}).filter(function (d, i) {
			return i < 5;
		});

		valuesList.selectAll("li").data(topValues).enter().append("li").text(function (d) {
			return d.key + " (" + d3.format("0.1%")(d.prop_n) + ")";
		}).attr("title", function (d) {
			return "n=" + d.n;
		}).style("cursor", "help");

		if (d.statistics.values.length > 5) {
			var totLength = d.statistics.values.length;
			var extraCount = totLength - 5;
			var extra_span = valuesList.append("span").html("and " + extraCount + " more.");
		}
	} else if (d.type == "continuous") {
		//valuesList.append("span").text( "Values (Most Frequent):"
		var sortedValues = d3.set(d.values).values() //get unique
		.map(function (d) {
			return +d;
		}) //convert to numeric
		.sort(function (a, b) {
			return a - b;
		}); // sort low to high

		var minValues = sortedValues.filter(function (d, i) {
			return i < 3;
		});
		var nValues = sortedValues.length;
		var maxValues = sortedValues.filter(function (d, i) {
			return i >= nValues - 3;
		});
		var valList = d3.merge([minValues, ["..."], maxValues]);

		valuesList.selectAll("li").data(valList).enter().append("li").text(function (d) {
			return d;
		}).attr("title", function (d) {
			return d == "..." ? nValues - 6 + " other values" : "";
		}).style("cursor", function (d) {
			return d == "..." ? "help" : null;
		});
	}
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function clone(obj) {
    var copy = void 0;

    //boolean, number, string, null, undefined
    if ('object' != (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) || null == obj) return obj;

    //date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    //array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    //object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error('Unable to copy [obj]! Its type is not supported.');
}

function moveYaxis(chart) {
    var ticks = chart.wrap.selectAll('g.y.axis g.tick');
    ticks.select('text').remove();
    ticks.append('title').text(function (d) {
        return d;
    });
    ticks.append('text').attr({ 'text-anchor': 'start',
        'alignment-baseline': 'middle',
        'dx': '1em',
        'x': chart.plot_width }).text(function (d) {
        return d.length < 30 ? d : d.substring(0, 30) + '...';
    });
}

function drawOverallMark(chart) {
    //Clear overall marks.
    chart.svg.selectAll('.overall-mark').remove();

    //For each mark draw an overall mark.
    chart.config.overall.forEach(function (d) {
        if (chart.config.y.order.indexOf(d.key) > -1) {
            var g = chart.svg.append('g').classed('overall-mark', true);
            var x = d.prop_n;
            var y = d.key;

            //Draw vertical line representing the overall rate of the current categorical value.
            if (chart.y(y)) {
                var rateLine = g.append('line').attr({ 'x1': chart.x(x),
                    'y1': chart.y(y),
                    'x2': chart.x(x),
                    'y2': chart.y(y) + chart.y.rangeBand() }).style({ 'stroke': 'black',
                    'stroke-width': '2px',
                    'stroke-opacity': '1' });
                rateLine.append('title').text('Overall rate: ' + d3.format('.1%')(x));
            }
        }
    });
}

function modifyOverallLegendMark(chart) {
    var legendItems = chart.wrap.selectAll('.legend-item'),
        overallMark = legendItems.filter(function (d) {
        return d.label === 'Overall';
    }).select('svg'),
        BBox = overallMark.node().getBBox();
    overallMark.select('.legend-mark').remove();
    overallMark.append('line').classed('legend-mark', true).attr({ 'x1': 3 * BBox.width / 4,
        'y1': 0,
        'x2': 3 * BBox.width / 4,
        'y2': BBox.height }).style({ 'stroke': 'black',
        'stroke-width': '2px',
        'stroke-opacity': '1' });
    legendItems.selectAll('circle').attr('r', '.4em');
}

function onResize() {
    moveYaxis(this);
    drawOverallMark(this);
    if (this.config.color_by) modifyOverallLegendMark(this);

    //Hide overall dots.
    if (this.config.color_by) this.svg.selectAll('.Overall').remove();else this.svg.selectAll('.point').remove();
}

function makeDotPlot(this_, d) {
    var chartContainer = d3.select(this_).node();
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
            tooltip: '[key]: [n] ([prop_n_text])' }],
        gridlines: 'xy',
        resizable: false,
        height: this_.height,
        margin: this_.margin,
        value_col: d.value_col,
        group_col: d.group || null,
        overall: d.statistics.values
    };

    //Sort data by descending rate and keep only the first five categories.
    var chartData = d.statistics.values.sort(function (a, b) {
        return a.prop_n > b.prop_n ? -2 : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1;
    }).slice(0, 5);
    chartSettings.y.order = chartData.map(function (d) {
        return d.key;
    }).reverse();

    if (d.groups) {
        //Define overall data.
        chartData.forEach(function (di) {
            return di.group = 'Overall';
        });

        //Add group data to overall data.
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

        //Overall mark
        chartSettings.marks[0].per.push('group');
        chartSettings.marks[0].values = { 'group': ['Overall'] };

        //Group marks
        chartSettings.marks[1] = clone(chartSettings.marks[0]);
        chartSettings.marks[1].values = { 'group': d.groups.map(function (d) {
                return d.group;
            }) };

        chartSettings.color_by = 'group';
        chartSettings.legend = { label: '',
            order: d.groups.map(function (d) {
                return d.group;
            }),
            mark: 'circle'
        };
    }

    var chart = webCharts.createChart(chartContainer, chartSettings);
    chart.on('resize', onResize);
    chart.init(chartData);
}

function onInit() {
    //Add group labels.
    var chart = this;
    if (this.config.group_col) {
        var groupTitle = this.wrap.append('p').attr("class", "panel-label").style("margin-left", chart.config.margin.left + "px").text(this.config.group_col + ": " + this.config.group_val + " (n=" + this.config.n + ")");
        this.wrap.node().parentNode.insertBefore(groupTitle.node(), this.wrap.node());
    }
}

function moveYaxis$1(chart) {
    var ticks = chart.wrap.selectAll('g.y.axis g.tick');
    ticks.select('text').remove();
    ticks.append('title').text(function (d) {
        return d;
    });
    ticks.append('text').attr({ 'text-anchor': 'start',
        'alignment-baseline': 'middle',
        'dx': '2.5em',
        'x': chart.plot_width }).text(function (d) {
        return d.length < 25 ? d : d.substring(0, 25) + '...';
    });
}

function drawOverallMark$1(chart) {
    //Clear overall marks.
    chart.svg.selectAll('.overall-mark').remove();

    //For each mark draw an overall mark.
    chart.config.overall.forEach(function (d) {
        if (chart.config.y.order.indexOf(d.key) > -1) {
            var g = chart.svg.append('g').classed('overall-mark', true);
            var x = d.prop_n;
            var y = d.key;

            //Draw vertical line representing the overall rate of the current categorical value.
            if (chart.y(y)) {
                var rateLine = g.append('line').attr({ 'x1': chart.x(x),
                    'y1': chart.y(y),
                    'x2': chart.x(x),
                    'y2': chart.y(y) + chart.y.rangeBand() }).style({ 'stroke': 'black',
                    'stroke-width': '2px',
                    'stroke-opacity': '1' });
                rateLine.append('title').text('Overall rate: ' + d3.format('.1%')(x));
            }
        }
    });
}

function drawDifferences(chart) {
    //Clear difference marks and annotations.
    chart.svg.selectAll('.difference-from-total').remove();

    //For each mark draw a difference mark and annotation.
    chart.current_data.forEach(function (d) {
        var overall = chart.config.overall.filter(function (di) {
            return di.key === d.key;
        })[0],
            g = chart.svg.append('g').classed('difference-from-total', true).style('display', 'none'),
            x = overall.prop_n,
            y = overall.key;

        //Draw line from overall rate to group rate.
        var diffLine = g.append('line').attr({ 'x1': chart.x(x),
            'y1': chart.y(y) + chart.y.rangeBand() / 2,
            'x2': chart.x(d.total),
            'y2': chart.y(y) + chart.y.rangeBand() / 2 }).style({ 'stroke': 'black',
            'stroke-width': '2px',
            'stroke-opacity': '.25' });
        diffLine.append('title').text('Difference from overall rate: ' + d3.format('.1f')((d.total - x) * 100));
        var diffText = g.append('text').attr({ 'x': chart.x(d.total),
            'y': chart.y(y) + chart.y.rangeBand() / 2,
            'dx': x < d.total ? '5px' : '-2px',
            'text-anchor': x < d.total ? 'beginning' : 'end',
            'font-size': '0.7em' }).text('' + (x < d.total ? '+' : x > d.total ? '-' : '') + d3.format('.1f')(Math.abs(d.total - x) * 100));
    });

    //Display difference from total on hover.
    chart.svg.on('mouseover', function () {
        chart.svg.selectAll('.difference-from-total').style('display', 'block');
        chart.svg.selectAll('.difference-from-total text').each(function () {
            d3.select(this).attr('dy', this.getBBox().height / 4);
        });
    }).on('mouseout', function () {
        return chart.svg.selectAll('.difference-from-total').style('display', 'none');
    });
}

function onResize$1() {
  console.log(this);
  moveYaxis$1(this);
  drawOverallMark$1(this);
  if (this.config.group_col) drawDifferences(this);
}

function makeBarChart(this_, d) {
    //hide the controls if the chart isn't Grouped
    var rowSelector = d3.select(this_).node().parentNode;
    var chartControls = d3.select(rowSelector).select(".row-controls").classed("hidden", !d.groups);

    //let height vary based on the number of levels
    var custom_height = d.statistics.values.length * 20 + 35; //35 ~= top and bottom margin

    //Chart settings
    var chartContainer = d3.select(this_).node();
    var chartSettings = { x: { column: 'prop_n',
            type: 'linear',
            label: '',
            format: '%',
            domain: [0, null] },
        y: { column: 'key',
            type: 'ordinal',
            label: '' },
        marks: [{ type: 'bar',
            per: ['key'],
            summarizeX: 'mean',
            tooltip: '[key]: [n] ([prop_n_text])',
            attributes: { stroke: null
            } }],
        colors: ['#999', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
        gridlines: 'xy',
        resizable: false,
        height: custom_height,
        margin: this_.margin,
        value_col: d.value_col,
        group_col: d.group || null,
        overall: d.statistics.values
    };

    //Sort data by descending rate and keep only the first five categories.
    var chartData = d.statistics.values.sort(function (a, b) {
        return a.prop_n > b.prop_n ? -2 : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1;
    });

    chartSettings.y.order = chartData.map(function (d) {
        return d.key;
    }).reverse();

    if (d.groups) {
        //Set upper limit of x-axis domain to the maximum group rate.
        chartSettings.x.domain[1] = d3.max(d.groups, function (di) {
            return d3.max(di.statistics.values, function (dii) {
                return dii.prop_n;
            });
        });

        d.groups.forEach(function (group) {
            //Define group-level settings.
            group.chartSettings = clone(chartSettings);
            group.chartSettings.group_val = group.group;
            group.chartSettings.n = group.values.length;

            //Sort data by descending rate and keep only the first five categories.
            group.data = group.statistics.values.filter(function (di) {
                return chartSettings.y.order.indexOf(di.key) > -1;
            }).sort(function (a, b) {
                return a.prop_n > b.prop_n ? -2 : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1;
            });

            //Define chart.
            group.chart = webCharts.createChart(chartContainer, group.chartSettings);
            group.chart.on('init', onInit);
            group.chart.on('resize', onResize$1);

            if (group.data.length) group.chart.init(group.data);else {
                d3.select(chartContainer).append('p').text(chartSettings.group_col + ': ' + group.chartSettings.group_val + ' (n=' + group.chartSettings.n + ')');
                d3.select(chartContainer).append('div').html('<em>This group does not contain any of the first 5 most prevalent levels of ' + d.value_col + '</em>.<br><br>');
            }
        });
    } else {
        //Define chart.
        var chart = webCharts.createChart(chartContainer, chartSettings);
        chart.on('init', onInit);
        chart.on('resize', onResize$1);
        chart.init(chartData);
    }
}

function makeBarChartControls(this_, d) {
  var chart_type_values = ["Paneled (Bar Charts)", "Grouped (Dot Plot)"];
  var wrap = d3.select(this_).append("div").attr("class", "row-controls");
  wrap.append("small").text("Display Type: ");
  var type_control = wrap.append("select");
  type_control.selectAll("option").data(chart_type_values).enter().append("option").text(function (d) {
    return d;
  });

  type_control.on("change", function () {
    d3.select(this_).selectAll(".wc-chart").remove();
    d3.select(this_).selectAll(".panel-label").remove();
    if (this.value == "Paneled (Bar Charts)") {
      makeBarChart(this_, d);
    } else {
      makeDotPlot(this_, d);
    }
  });
}

function makeTooltip(d, i, context) {
    var format = d3.format(context.config.measureFormat);
    d.selector = 'bar' + i;
    //Define tooltips.
    var tooltip = context.svg.append('g').classed('tooltip', true).attr('id', d.selector);
    var text = tooltip.append('text').attr({ 'id': 'text',
        'x': context.x(d.key),
        'y': context.plot_height,
        'dy': '-.75em',
        'font-size': '75%',
        'font-weight': 'bold',
        'fill': 'white' });
    text.append('tspan').attr({ 'x': context.x(d.key),
        'dx': context.x(d.key) < context.plot_width / 2 ? '1em' : '-1em',
        'text-anchor': context.x(d.key) < context.plot_width / 2 ? 'start' : 'end' }).text('' + d.key);
    text.append('tspan').attr({ 'x': context.x(d.key),
        'dx': context.x(d.key) < context.plot_width / 2 ? '1em' : '-1em',
        'dy': '-1.5em',
        'text-anchor': context.x(d.key) < context.plot_width / 2 ? 'start' : 'end' }).text("n=" + d.values.raw[0].n + " (" + d3.format('0.1%')(d.total) + ")");
    var dimensions = text[0][0].getBBox();
    var background = tooltip.append('rect').attr({ 'id': 'background',
        'x': dimensions.x - 5,
        'y': dimensions.y - 2,
        'width': dimensions.width + 10,
        'height': dimensions.height + 4 }).style({ 'fill': 'black',
        'stroke': 'white' });
    tooltip[0][0].insertBefore(background[0][0], text[0][0]);
}

function onResize$2() {
    var context = this;
    //remove x-axis text
    var ticks = this.wrap.selectAll('g.x.axis g.tick');
    ticks.select("text").remove();
    this.svg.selectAll('g.bar-group').each(function (d, i) {
        makeTooltip(d, i, context);
    });

    //Add modal to nearest mark.
    var bars = this.svg.selectAll('.bar-group');
    var tooltips = this.svg.selectAll('.tooltip');
    var statistics = this.svg.selectAll('.statistic');
    this.svg.on('mousemove', function () {
        //Highlight closest bar.
        var mouse = d3.mouse(this);
        var x = mouse[0];
        var y = mouse[1];
        var minimum = void 0;
        var bar = {};
        bars.each(function (d, i) {
            d.distance = Math.abs(context.x(d.key) - x);
            if (i === 0 || d.distance < minimum) {
                minimum = d.distance;
                bar = d;
            }
        });
        var closest = bars.filter(function (d) {
            return d.distance === minimum;
        }).filter(function (d, i) {
            return i === 0;
        }).select("rect").style('fill', '#7BAFD4');

        //Activate tooltip.
        var d = closest.datum();
        tooltips.classed('active', false);
        context.svg.select('#' + d.selector).classed('active', true);
    }).on('mouseout', function () {
        bars.select("rect").style('fill', '#999');
        context.svg.selectAll('g.tooltip').classed('active', false);
    });
}

function onInit$1() {
    //Add group labels.
    var chart = this;
    if (this.config.group_col) {
        var groupTitle = this.wrap.append('p').attr("class", "panel-label").style("margin-left", chart.config.margin.left + "px").text(this.config.group_col + ": " + this.config.group_val + " (n=" + this.config.n + ")");
        this.wrap.node().parentNode.insertBefore(groupTitle.node(), this.wrap.node());
    }
}

function axisSort(a, b, type) {
  var alpha = a.key < b.key ? -1 : 1;
  if (type == "Alphabetical") {
    return alpha;
  } else if (type == "Descending") {
    return a.prop_n > b.prop_n ? -2 : a.prop_n < b.prop_n ? 2 : alpha;
  } else if (type == "Ascending") {
    return a.prop_n > b.prop_n ? 2 : a.prop_n < b.prop_n ? -2 : alpha;
  }
}

function makeLevelChart(this_, d) {
  var chartContainer = d3.select(this_).node();
  var rowSelector = d3.select(this_).node().parentNode;
  var sortType = d3.select(rowSelector).select(".row-controls").select("select").property('value');
  var chartSettings = { y: { column: 'prop_n',
      type: 'linear',
      label: '',
      format: '0.1%',
      domain: [0, null] },
    x: { column: 'key',
      type: 'ordinal',
      label: '' },
    marks: [{ type: 'bar',
      per: ['key'],
      summarizeX: 'mean',
      attributes: { stroke: null,
        fill: "#999"
      } }],
    gridlines: '',
    resizable: false,
    height: this_.height,
    margin: this_.margin,
    value_col: d.value_col,
    group_col: d.group || null,
    overall: d.statistics.values,
    sort: sortType //Alphabetical, Ascending, Descending
  };

  chartSettings.margin.left = 50;
  chartSettings.margin.bottom = 10;

  var chartData = d.statistics.values.sort(function (a, b) {
    return axisSort(a, b, chartSettings.sort);
  });

  chartSettings.x.order = chartData.map(function (d) {
    return d.key;
  });
  var x_dom = chartData.map(function (d) {
    return d.key;
  });

  if (d.groups) {
    //Set upper limit of y-axis domain to the maximum group rate.
    chartSettings.y.domain[1] = d3.max(d.groups, function (di) {
      return d3.max(di.statistics.values, function (dii) {
        return dii.prop_n;
      });
    });

    chartSettings.x.domain = x_dom; //use the overall x domain in paneled charts
    d.groups.forEach(function (group) {
      //Define group-level settings.
      group.chartSettings = clone(chartSettings);
      group.chartSettings.group_val = group.group;
      group.chartSettings.n = group.values.length;

      //Sort data by descending rate and keep only the first five categories.
      group.data = group.statistics.values;

      //Define chart.
      group.chart = webCharts.createChart(chartContainer, group.chartSettings);
      group.chart.on('init', onInit$1);
      group.chart.on('resize', onResize$2);

      if (group.data.length) group.chart.init(group.data);else {
        d3.select(chartContainer).append('p').text(chartSettings.group_col + ': ' + group.chartSettings.group_val + ' (n=' + group.chartSettings.n + ')');

        d3.select(chartContainer).append('div').html('<em>No data available for this level.</em>.<br><br>');
      }
    });
  } else {
    //Define chart.
    var chart = webCharts.createChart(chartContainer, chartSettings);
    chart.on('init', onInit$1);
    chart.on('resize', onResize$2);
    chart.init(chartData);
  }
}

function makeLevelChartControls(this_, d) {
  var sort_values = ["Alphabetical", "Ascending", "Descending"];
  var wrap = d3.select(this_).append("div").attr("class", "row-controls");
  wrap.append("small").text("Sort levels: ");
  var x_sort = wrap.append("select");
  x_sort.selectAll("option").data(sort_values).enter().append("option").text(function (d) {
    return d;
  });

  x_sort.on("change", function () {
    d3.select(this_).selectAll(".wc-chart").remove();
    d3.select(this_).selectAll(".panel-label").remove();
    makeLevelChart(this_, d);
  });
}

if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';

            if (target === undefined || target === null) throw new TypeError('Cannot convert undefined or null to object');

            var output = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];

                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) output[nextKey] = source[nextKey];
                    }
                }
            }

            return output;
        };
    })();
}

var defaultSettings = //Custom settings
{ measure: null,
    panel: null,
    measureFormat: ',.2f',
    boxPlot: true,
    nBins: null,
    mean: true,
    overall: false,
    boxPlotHeight: 20

    //Webcharts settings
    , x: { column: null // set in syncSettings()
        , type: 'linear',
        label: '',
        bin: null } // set in syncSettings()
    , y: { column: null // set in syncSettings()
        , type: 'linear',
        label: '',
        domain: [0, null] },
    marks: [{ type: 'bar',
        per: null // set in syncSettings()
        , summarizeX: 'mean',
        summarizeY: 'count',
        attributes: { fill: "#999",
            stroke: "#333",
            "stroke-width": "2px" }
    }],
    gridlines: 'y',
    resizable: true,
    aspect: 12,
    margin: { right: 25,
        left: 100 } // space for panel value
};

//Replicate settings in multiple places in the settings object.
function syncSettings(settings) {
    var syncedSettings = clone(settings);

    if (syncedSettings.panel === null) syncedSettings.overall = true;
    syncedSettings.x.column = settings.measure;
    syncedSettings.x.bin = settings.nBins;
    syncedSettings.y.column = settings.measure;
    syncedSettings.y.label = settings.measure;
    syncedSettings.marks[0].per = [settings.measure];
    syncedSettings.margin.bottom = settings.boxPlotHeight + 20;
    return syncedSettings;
}

function makeTooltip$1(d, i, context) {
    var format = d3.format(context.config.measureFormat);
    d.midpoint = (d.rangeHigh + d.rangeLow) / 2;
    d.range = format(d.rangeLow) + '-' + format(d.rangeHigh);
    d.selector = 'bar' + i;
    //Define tooltips.
    var tooltip = context.svg.append('g').classed('tooltip', true).attr('id', d.selector);
    var text = tooltip.append('text').attr({ 'id': 'text',
        'x': context.x(d.midpoint),
        'y': context.plot_height,
        'dy': '-.75em',
        'font-size': '75%',
        'font-weight': 'bold',
        'fill': 'white' });
    text.append('tspan').attr({ 'x': context.x(d.midpoint),
        'dx': context.x(d.midpoint) < context.plot_width / 2 ? '1em' : '-1em',
        'text-anchor': context.x(d.midpoint) < context.plot_width / 2 ? 'start' : 'end' }).text('Range: ' + d.range);
    text.append('tspan').attr({ 'x': context.x(d.midpoint),
        'dx': context.x(d.midpoint) < context.plot_width / 2 ? '1em' : '-1em',
        'dy': '-1.5em',
        'text-anchor': context.x(d.midpoint) < context.plot_width / 2 ? 'start' : 'end' }).text('n: ' + d.total);
    var dimensions = text[0][0].getBBox();
    var background = tooltip.append('rect').attr({ 'id': 'background',
        'x': dimensions.x - 5,
        'y': dimensions.y - 2,
        'width': dimensions.width + 10,
        'height': dimensions.height + 4 }).style({ 'fill': 'black',
        'stroke': 'white' });
    tooltip[0][0].insertBefore(background[0][0], text[0][0]);
}

function moveYaxis$2(chart) {
    var ticks = chart.wrap.selectAll('g.y.axis g.tick');
    ticks.select('text').remove();
    ticks.append('title').text(function (d) {
        return d;
    });
    ticks.append('text').attr({ 'text-anchor': 'start',
        'alignment-baseline': 'middle',
        'dx': '.5em',
        'x': chart.plot_width }).text(function (d) {
        return d;
    });
}

function onResize$3() {
    var context = this;
    var format = d3.format(this.config.measureFormat);

    moveYaxis$2(this);

    //Hide overall plot if [settings.overall] is set to false.
    if (!this.config.overall && !this.group) this.wrap.style('display', 'none');else {
        //Clear custom marks.
        this.svg.selectAll('g.tooltip').remove();
        this.svg.selectAll('.statistic').remove();

        this.svg.selectAll('g.bar-group').each(function (d, i) {
            makeTooltip$1(d, i, context);
        });

        //Annotate quantiles
        if (this.config.boxPlot) {
            var quantiles = [{ probability: .05, label: '5th percentile' }, { probability: .25, label: '1st quartile' }, { probability: .50, label: 'Median' }, { probability: .75, label: '3rd quartile' }, { probability: .95, label: '95th percentile' }];

            for (var item in quantiles) {
                var quantile = quantiles[item];
                quantile.quantile = d3.quantile(this.values, quantile.probability);

                //Horizontal lines
                if ([.05, .75].indexOf(quantile.probability) > -1) {
                    var rProbability = quantiles[+item + 1].probability;
                    var rQuantile = d3.quantile(this.values, rProbability);
                    var whisker = this.svg.append('line').attr({ 'class': 'statistic',
                        'x1': this.x(quantile.quantile),
                        'y1': this.plot_height + this.config.boxPlotHeight / 2,
                        'x2': this.x(rQuantile),
                        'y2': this.plot_height + this.config.boxPlotHeight / 2 }).style({ 'stroke': 'red',
                        'stroke-width': '2px',
                        'opacity': .25 });
                    whisker.append('title').text('Q' + quantile.probability + '-Q' + rProbability + ': ' + format(quantile.quantile) + '-' + format(rQuantile));
                }

                //Box
                if (quantile.probability === .25) {
                    var q3 = d3.quantile(this.values, .75);
                    var interQ = this.svg.append('rect').attr({ 'class': 'statistic',
                        'x': this.x(quantile.quantile),
                        'y': this.plot_height,
                        'width': this.x(q3) - this.x(quantile.quantile),
                        'height': this.config.boxPlotHeight }).style({ 'fill': '#7BAFD4',
                        'opacity': .25 });
                    interQ.append('title').text('Interquartile range: ' + format(quantile.quantile) + '-' + format(q3));
                }

                //Vertical lines
                quantile.mark = this.svg.append('line').attr({ 'class': 'statistic',
                    'x1': this.x(quantile.quantile),
                    'y1': this.plot_height,
                    'x2': this.x(quantile.quantile),
                    'y2': this.plot_height + this.config.boxPlotHeight }).style({ 'stroke': [.05, .95].indexOf(quantile.probability) > -1 ? 'red' : [.25, .75].indexOf(quantile.probability) > -1 ? 'blue' : 'black',
                    'stroke-width': '3px' });
                quantile.mark.append('title').text(quantile.label + ': ' + format(quantile.quantile));
            }
        }

        //Annotate mean.
        if (this.config.mean) {
            var mean = d3.mean(this.values);
            var sd = d3.deviation(this.values);
            var meanMark = this.svg.append('circle').attr({ 'class': 'statistic',
                'cx': this.x(mean),
                'cy': this.plot_height + this.config.boxPlotHeight / 2,
                'r': this.config.boxPlotHeight / 3 }).style({ 'fill': '#ccc',
                'stroke': 'black',
                'stroke-width': '1px' });
            meanMark.append('title').text('n: ' + this.values.length + '\nMean: ' + format(mean) + '\nSD: ' + format(sd));
        }

        //Rotate y-axis labels.
        this.svg.select('g.y.axis text.axis-title').remove();
        this.svg.select('g.y.axis').insert('text', ':first-child').attr({ 'class': 'axis-title',
            'x': this.plot_width,
            'y': this.plot_height / 2,
            'dx': '1em' }).style('text-anchor', 'start').text(this.group ? 'Level: ' + this.config.y.label + " \n(n=" + this.values.length + ")" : "");

        //Hide legends.
        this.wrap.select('ul.legend').remove();

        //Shift x-axis tick labels downward.
        var yticks = this.svg.select('.x.axis').selectAll('g.tick');
        yticks.select('text').remove();
        yticks.append('text').attr('y', context.config.boxPlotHeight).attr('dy', "1em").attr('x', 0).attr('text-anchor', 'middle').attr('alignment-baseline', 'top').text(function (d) {
            return d;
        });

        //Add modal to nearest mark.
        var bars = this.svg.selectAll('.bar-group');
        var tooltips = this.svg.selectAll('.tooltip');
        var statistics = this.svg.selectAll('.statistic');
        this.svg.on('mousemove', function () {
            //Highlight closest bar.
            var mouse = d3.mouse(this);
            var x = context.x.invert(mouse[0]);
            var y = context.y.invert(mouse[1]);
            var minimum = void 0;
            var bar = {};
            bars.each(function (d, i) {
                d.distance = Math.abs(d.midpoint - x);
                if (i === 0 || d.distance < minimum) {
                    minimum = d.distance;
                    bar = d;
                }
            });
            var closest = bars.filter(function (d) {
                return d.distance === minimum;
            }).filter(function (d, i) {
                return i === 0;
            }).select("rect").style('fill', '#7BAFD4');

            //Activate tooltip.
            var d = closest.datum();
            tooltips.classed('active', false);
            context.svg.select('#' + d.selector).classed('active', true);
        }).on('mouseout', function () {
            bars.select("rect").style('fill', '#999');
            context.svg.selectAll('g.tooltip').classed('active', false);
        });
    }
}

function onInit$2() {
    var context = this;
    var config = this.initialSettings;
    var measure = config.measure;
    var panel = config.panel;

    //Remove non-numeric and missing values.
    if (!this.group) {
        this.initialSettings.unfilteredData = this.raw_data;
        this.raw_data = this.initialSettings.unfilteredData.filter(function (d) {
            return !isNaN(+d[measure]) && !/^\s*$/.test(d[measure]);
        });
    }

    //Create array of values.
    this.values = this.raw_data.map(function (d) {
        return +d[measure];
    }).sort(function (a, b) {
        return a - b;
    });

    //Define x-axis domain as the range of the measure, regardless of subgrouping.
    if (!this.initialSettings.xDomain) {
        this.initialSettings.xDomain = d3.extent(this.values);
        config.xDomain = this.initialSettings.xDomain;
    }
    this.config.x.domain = this.initialSettings.xDomain;

    /**-------------------------------------------------------------------------------------------\
      Paneling
    \-------------------------------------------------------------------------------------------**/

    if (panel && !this.group) {
        //Nest data by paneling variable to efine y-axis domain as the maximum number of observations
        //in a single bin within a subgrouping.
        var max = 0;
        if (!config.y.domain[1]) {
            var nestedData = d3.nest().key(function (d) {
                return d[panel];
            }).entries(context.raw_data);
            nestedData.forEach(function (group) {
                var domain = d3.extent(group.values, function (d) {
                    return +d[measure];
                });
                var binWidth = (domain[1] - domain[0]) / config.nBins;
                group.values.forEach(function (d) {
                    d.bin = Math.floor((+d[measure] - domain[0]) / binWidth) - (+d[measure] === domain[1]) * 1;
                });
                var bins = d3.nest().key(function (d) {
                    return d.bin;
                }).rollup(function (d) {
                    return d.length;
                }).entries(group.values);
                max = Math.max(max, d3.max(bins, function (d) {
                    return d.values;
                }));
            });
        }

        //Plot the chart for each group.
        var groups = d3.set(context.raw_data.map(function (d) {
            return d[panel];
        })).values().map(function (d) {
            return { group: d };
        }).sort(function (a, b) {
            return a.group < b.group ? -1 : 1;
        });
        groups.forEach(function (group, i) {
            group.settings = clone(config);
            group.settings.y.label = group.group;
            group.settings.y.domain = [0, max];
            group.data = context.raw_data.filter(function (d) {
                return d[panel] === group.group;
            });
            group.webChart = new webCharts.createChart(config.container, group.settings);
            group.webChart.initialSettings = group.settings;
            group.webChart.group = group.group;
            group.webChart.on('init', onInit$2);
            group.webChart.on('resize', onResize$3);
            group.webChart.init(group.data);
        });
    }
}

function defineHistogram(element, settings) {
    //Merge specified settings with default settings.
    var mergedSettings = Object.assign({}, defaultSettings, settings);

    //Sync properties within merged settings.
    var syncedSettings = syncSettings(mergedSettings);

    //Sync control inputs with merged settings.
    //let syncedControlInputs = syncControlInputs(controlInputs, mergedSettings);
    //let controls = createControls(element, {location: 'top', inputs: syncedControlInputs});

    //Define chart.
    var chart = webcharts.createChart(element, syncedSettings); // Add third argument to define controls as needed.
    chart.initialSettings = clone(syncedSettings);
    chart.initialSettings.container = element;
    chart.on('init', onInit$2);
    chart.on('resize', onResize$3);

    return chart;
}

function makeHistogram(this_, d) {
    var chartContainer = d3.select(this_).node();
    var chartSettings = { measure: ' ',
        resizable: false,
        height: 100,
        margin: this_.margin,
        nBins: d.bins };
    var chartData = [];

    if (d.groups) {
        chartSettings.panel = 'group';
        d.groups.forEach(function (group) {
            group.values.forEach(function (value) {
                chartData.push({ group: group.group, ' ': value });
            });
        });
    } else {
        d.values.forEach(function (d) {
            chartData.push({ ' ': d });
        });
    }

    var chart = defineHistogram(chartContainer, chartSettings);
    chart.init(chartData);
}

function makeChart(d) {
  //Common chart settings
  this.height = 100;
  this.margin = { right: 200, left: 30 };

  if (d.chartType === 'barChart') {
    makeBarChartControls(this, d);
    makeBarChart(this, d);
  } else if (d.chartType === 'levelChart') {
    makeLevelChartControls(this, d);
    makeLevelChart(this, d);
  } else if (d.chartType === 'histogram') {
    // continuous outcomes
    makeHistogram(this, d);
  } else {
    console.warn('Invalid chart type for ' + d.key);
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
        return ['min', 'max'].indexOf(statItem.key) === -1;
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

    var rowHead = rowWrap.append("div").attr("class", "row-head section");

    rowHead.append('div').attr('class', 'row-toggle').html("&#9658;").on("click", function () {
        var rowDiv = d3.select(this.parentNode.parentNode);
        var chartDiv = rowDiv.select(".row-chart");
        var hiddenFlag = rowDiv.classed("hiddenChart");
        rowDiv.classed("hiddenChart", !hiddenFlag);
        d3.select(this).html(hiddenFlag ? "&#9660;" : "&#9658;");
    });

    rowHead.append('div').attr('class', 'row-title').each(makeTitle);
    rowHead.append('div').attr('class', 'row-details').each(makeDetails);
    rowWrap.append('div').attr('class', 'row-chart section').each(makeChart);
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

/*------------------------------------------------------------------------------------------------\
  Define summaryTable object (the meat and potatoes).
\------------------------------------------------------------------------------------------------*/

var summaryTable = { init: init$5,
  draw: draw,
  destroy: destroy,
  renderRow: renderRow,
  updateSummaryText: updateSummaryText
};

var defaultSettings$1 = {
	filters: [],
	groups: [],
	autogroups: 5, //automatically include categorical vars with 2-5 levels in the groups dropdown
	autofilter: 10, //automatically make filters for categorical variables with 2-10 levels
	autobins: true,
	nBins: 100,
	levelSplit: 5 //cutpoint for # of levels to use levelPlot() renderer 
};

function setDefaults(chart) {

	/********************* Filter Settings *********************/
	chart.config.filters = chart.config.filters || defaultSettings$1.filters;

	//autofilter - don't use automatic filter if user specifies filters object
	chart.config.autofilter = chart.config.filters.length > 0 ? false : chart.config.autofilter == null ? defaultSettings$1.autofilter : chart.config.autofilter;

	/********************* Group Settings *********************/
	chart.config.groups = chart.config.groups || defaultSettings$1.groups;

	//autogroups - don't use automatic groups if user specifies groups object
	chart.config.autogroups = chart.config.groups.length > 0 ? false : chart.config.autogroups == null ? defaultSettings$1.autogroups : chart.config.autogroups;

	/********************* Histogram Settings *********************/
	chart.config.nBins = chart.config.nBins || defaultSettings$1.nBins;
	chart.config.autobins = chart.config.autobins == null ? defaultSettings$1.autobins : chart.config.autobins;

	/********************* Histogram Settings *********************/
	chart.config.levelSplit = chart.config.levelSplit || defaultSettings$1.levelSplit;
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

// determine the number of bins to use in the histogram based on the data.
// Based on an implementation of the Freedman-Diaconis
// See https://en.wikipedia.org/wiki/Freedman%E2%80%93Diaconis_rule for more
// values should be an array of numbers

function getBinCounts(codebook) {

  //function to set the bin count for a single variable
  function setBinCount(summaryData) {
    //Freedman-Diaconis rule - returns the recommended bin size for a histogram
    function FreedmanDiaconis(IQR, n) {
      var cubeRootN = Math.cbrt(n);
      return 2 * (IQR / cubeRootN);
    }

    var IQR = +summaryData.statistics["3rd quartile"] - +summaryData.statistics["1st quartile"];
    var n = summaryData.statistics["n"];
    var range = +summaryData.statistics["max"] - +summaryData.statistics["min"];
    var binSize = FreedmanDiaconis(IQR, n);
    var bins = Math.ceil(range / binSize);

    return bins;
  }

  var continuousVars = codebook.data.summary.filter(function (d) {
    return d.type == "continuous";
  });
  continuousVars.forEach(function (cvar) {
    cvar.bins = codebook.config.autoBins ? codebook.config.nBins : setBinCount(cvar);
    if (Object.keys(codebook.config).indexOf("group") > -1) {

      cvar.groups.forEach(function (gvar) {
        gvar.bins = codebook.config.autoBins ? codebook.config.nBins : setBinCount(gvar);
      });
    }
  });
}

/*------------------------------------------------------------------------------------------------\
  Define util object.
\------------------------------------------------------------------------------------------------*/

var util = {
	setDefaults: setDefaults,
	makeAutomaticFilters: makeAutomaticFilters,
	makeAutomaticGroups: makeAutomaticGroups,
	getBinCounts: getBinCounts
};

function makeSummary(codebook) {
    var data = codebook.data.filtered;
    var group = codebook.config.group;

    function determineType(vector) {
        var nonMissingValues = vector.filter(function (d) {
            return !/^\s*$/.test(d);
        });
        var numericValues = nonMissingValues.filter(function (d) {
            return !isNaN(+d);
        });
        var distinctValues = d3.set(numericValues).values();

        return nonMissingValues.length === numericValues.length && distinctValues.length > codebook.config.levelSplit ? 'continuous' : 'categorical';
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
                    prop_n: d.length / statistics.n,
                    prop_N_text: d3.format("0.1%")(d.length / statistics.N),
                    prop_n_text: d3.format("0.1%")(d.length / statistics.n)
                };
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

    if (codebook.data.filtered.length > 0) {
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
            //determine the renderer to use
            console.log(codebook.config.levelSplit);
            variables[i].chartType = variables[i].type == "continuous" ? "histogram" : variables[i].type == "categorical" & variables[i].statistics.values.length > codebook.config.levelSplit ? "levelChart" : variables[i].type == "categorical" & variables[i].statistics.values.length <= codebook.config.levelSplit ? "barChart" : "error";

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

        codebook.data.summary = variables;
        //get bin counts
        codebook.util.getBinCounts(codebook);
    } else {
        codebook.data.summary = [];
    }
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

/*------------------------------------------------------------------------------------------------\
  Define data object.
\------------------------------------------------------------------------------------------------*/

var data = {
    makeSummary: makeSummary,
    makeFiltered: makeFiltered

};

function createChart$1() {
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

function init$6() {
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

function init$7(explorer) {
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

/*------------------------------------------------------------------------------------------------\
  Define controls object.
\------------------------------------------------------------------------------------------------*/

var controls$1 = {
  init: init$7
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
        init: init$6,
        layout: layout$1,
        controls: controls$1,
        makeCodebook: makeCodebook
    };

    return explorer;
}

var index = {
  createChart: createChart$1,
  createExplorer: createExplorer
};

return index;

}(webCharts));
