var webcodebook = function (webcharts) {
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
			chart.data.summary = chart.data.filtered.length > 0 ? chart.data.makeSummary(chart.data.filtered, chart.config.group) : [];
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
				chart.config.group = this.value !== 'None' ? this.value : null;
				chart.data.filtered = chart.data.makeFiltered(chart.data.raw, chart.config.filters);
				chart.data.summary = chart.data.filtered.length > 0 ? chart.data.makeSummary(chart.data.filtered, chart.config.group) : [];
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

	function makeTitle(d) {
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
			marks: [{ type: 'text',
				text: "|",
				attributes: { "font-weight": 'bold', "alignment-baseline": "middle" },
				per: ['key'],
				summarizeX: 'mean',
				tooltip: '[key]: [n] ([prop_n])' }],
			gridlines: 'xy',
			resizable: false,
			height: this_.height,
			margin: this_.margin
		};

		var chartData = d.statistics.values.sort(function (a, b) {
			return a.prop_n > b.prop_n ? -2 : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1;
		}).slice(0, 5);
		chartSettings.y.order = chartData.map(function (d) {
			return d.key;
		}).reverse();
		console.log(d);
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
			console.log(chartData);
			chartSettings.marks[0].per.push('group');
			chartSettings.marks[0].values = { 'group': ['All'] };
			chartSettings.marks.push({ type: 'circle',
				per: ['key', 'group'],
				summarizeX: 'mean',
				radius: 3,
				values: { 'group': d.groups.map(function (d) {
						return d.group;
					}) } });
			chartSettings.color_by = 'group';
			chartSettings.legend = { label: '',
				order: d.groups.map(function (d) {
					return d.group;
				}),
				mark: "circle"
			};
			console.log(d.groups.map(function (d) {
				return d.group;
			}));
		}

		var chart = webCharts.createChart(chartContainer, chartSettings);
		chart.on("resize", function () {
			var allLegend = this.wrap.select("ul.legend").select("li");
			allLegend.select("svg").remove();
			allLegend.select("span.legend-mark-text").text("|").style("color", "black").style("font-weight", "bolder");
		});
		chart.init(chartData);
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

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var asyncGenerator = function () {
		function AwaitValue(value) {
			this.value = value;
		}

		function AsyncGenerator(gen) {
			var front, back;

			function send(key, arg) {
				return new Promise(function (resolve, reject) {
					var request = {
						key: key,
						arg: arg,
						resolve: resolve,
						reject: reject,
						next: null
					};

					if (back) {
						back = back.next = request;
					} else {
						front = back = request;
						resume(key, arg);
					}
				});
			}

			function resume(key, arg) {
				try {
					var result = gen[key](arg);
					var value = result.value;

					if (value instanceof AwaitValue) {
						Promise.resolve(value.value).then(function (arg) {
							resume("next", arg);
						}, function (arg) {
							resume("throw", arg);
						});
					} else {
						settle(result.done ? "return" : "normal", result.value);
					}
				} catch (err) {
					settle("throw", err);
				}
			}

			function settle(type, value) {
				switch (type) {
					case "return":
						front.resolve({
							value: value,
							done: true
						});
						break;

					case "throw":
						front.reject(value);
						break;

					default:
						front.resolve({
							value: value,
							done: false
						});
						break;
				}

				front = front.next;

				if (front) {
					resume(front.key, front.arg);
				} else {
					back = null;
				}
			}

			this._invoke = send;

			if (typeof gen.return !== "function") {
				this.return = undefined;
			}
		}

		if (typeof Symbol === "function" && Symbol.asyncIterator) {
			AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
				return this;
			};
		}

		AsyncGenerator.prototype.next = function (arg) {
			return this._invoke("next", arg);
		};

		AsyncGenerator.prototype.throw = function (arg) {
			return this._invoke("throw", arg);
		};

		AsyncGenerator.prototype.return = function (arg) {
			return this._invoke("return", arg);
		};

		return {
			wrap: function (fn) {
				return function () {
					return new AsyncGenerator(fn.apply(this, arguments));
				};
			},
			await: function (value) {
				return new AwaitValue(value);
			}
		};
	}();

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

	var defaultSettings = { measure: null,
		panel: null,
		measureFormat: ',.2f',
		boxPlot: true,
		mean: true,
		nBins: 100,
		overall: false

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
			summarizeY: 'count' }],
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

		return syncedSettings;
	}

	function onResize() {
		var context = this;
		var format = d3.format(this.config.measureFormat);

		//Hide overall plot if [settings.overall] is set to false.
		if (!this.config.overall && !this.group) this.wrap.style('display', 'none');else {
			//Clear custom marks.
			this.svg.selectAll('rect.wc-data-mark').style('display', 'none');
			this.svg.selectAll('line.spike').remove();
			this.svg.selectAll('g.tooltip').remove();
			this.svg.selectAll('.statistic').remove();

			//Replace rects with lines.
			this.svg.selectAll('g.bar-group').each(function (d, i) {
				//Define spikes.
				d.midpoint = (d.rangeHigh + d.rangeLow) / 2;
				d.range = format(d.rangeLow) + '-' + format(d.rangeHigh);
				d.selector = 'range' + d.range.replace(/\./g, 'd').replace(',', '_');
				var spike = d3.select(this).append('line').datum(d).attr({ 'class': 'spike',
					'x1': context.x(d.midpoint),
					'y1': context.plot_height,
					'x2': context.x(d.midpoint),
					'y2': context.y(d.total) }).style({ 'stroke': 'black',
					'stroke-width': '3px' });

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
							'y1': this.plot_height + 4,
							'x2': this.x(rQuantile),
							'y2': this.plot_height + 4 }).style({ 'stroke': 'red',
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
							'height': 8 }).style({ 'fill': 'blue',
							'opacity': .25 });
						interQ.append('title').text('Interquartile range: ' + format(quantile.quantile) + '-' + format(q3));
					}

					//Vertical lines
					quantile.mark = this.svg.append('line').attr({ 'class': 'statistic',
						'x1': this.x(quantile.quantile),
						'y1': this.plot_height,
						'x2': this.x(quantile.quantile),
						'y2': this.plot_height + 8 }).style({ 'stroke': [.05, .95].indexOf(quantile.probability) > -1 ? 'red' : [.25, .75].indexOf(quantile.probability) > -1 ? 'blue' : 'black',
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
					'cy': this.plot_height + 4,
					'r': 3 }).style({ 'fill': '#ccc',
					'stroke': 'black',
					'stroke-width': '1px' });
				meanMark.append('title').text('n: ' + this.values.length + '\nMean: ' + format(mean) + '\nSD: ' + format(sd));
			}

			//Rotate y-axis labels.
			this.svg.select('g.y.axis text.axis-title').remove();
			this.svg.select('g.y.axis').insert('text', ':first-child').attr({ 'class': 'axis-title',
				'x': 0,
				'y': this.plot_height / 2,
				'dx': '-2.5em' }).style('text-anchor', 'end').text(this.config.y.label);

			//Hide legends.
			this.wrap.select('ul.legend').remove();

			//Shift x-axis tick labels downward.
			this.svg.select('.x.axis').selectAll('g.tick text').attr('dy', '1em');

			//Add modal to nearest mark.
			var spikes = this.svg.selectAll('.spike');
			var tooltips = this.svg.selectAll('.tooltip');
			var statistics = this.svg.selectAll('.statistic');
			this.svg.on('mousemove', function () {
				//Highlight closest spike.
				var mouse = d3.mouse(this);
				var x = context.x.invert(mouse[0]);
				var y = context.y.invert(mouse[1]);
				var minimum = void 0;
				var spike = {};
				spikes.style('stroke', 'black').each(function (d, i) {
					d.distance = Math.abs(d.midpoint - x);
					if (i === 0 || d.distance < minimum) {
						minimum = d.distance;
						spike = d;
					}
				});
				var closest = spikes.filter(function (d) {
					return d.distance === minimum;
				}).filter(function (d, i) {
					return i === 0;
				}).style('stroke', 'red');

				//Activate tooltip.
				var d = closest.datum();
				tooltips.classed('active', false);
				context.svg.select('#' + d.selector).classed('active', true);
			}).on('mouseout', function () {
				spikes.style('stroke', 'black');
				tooltips.classed('active', false);
			});
		}
	}

	function onInit() {
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
				group.webChart.on('init', onInit);
				group.webChart.on('resize', onResize);
				group.webChart.init(group.data);
			});
		}
	}

	function onLayout() {}

	function onPreprocess() {}

	function onDataTransform() {}

	function onDraw() {}

	function createHistogram(element, settings) {
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
		chart.on('init', onInit);
		chart.on('layout', onLayout);
		chart.on('preprocess', onPreprocess);
		chart.on('datatransform', onDataTransform);
		chart.on('draw', onDraw);
		chart.on('resize', onResize);

		return chart;
	}

	function makeHistogram(this_, d) {
		var chartContainer = d3.select(this_).node();
		var chartSettings = { measure: ' ',
			resizable: false,
			height: 100,
			margin: this_.margin };
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

		var chart = createHistogram(chartContainer, chartSettings);
		chart.init(chartData);
	}

	function makeChart(d) {
		//Common chart settings
		this.margin = {};
		this.height = 100;

		if (d.type === 'categorical') {
			// categorical outcomes
			makeDotPlot(this, d);
		} else {
			// continuous outcomes
			makeHistogram(this, d);
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
		});
		//    .filter(statItem => ['N', 'n'].indexOf(statItem.key) === -1);

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

	var summaryTable = { init: init$4,
		draw: draw,
		destroy: destroy,
		renderRow: renderRow,
		updateSummaryText: updateSummaryText
	};

	var defaultSettings$1 = {
		filters: [],
		groups: [],
		autogroups: 5, //automatically include categorical vars with 2-5 levels in the groups dropdown
		autofilter: 10 };

	function setDefaults(chart) {

		/********************* Filter Settings *********************/
		chart.config.filters = chart.config.filters || defaultSettings$1.filters;

		//autofilter - don't use automatic filter if user specifies filters object
		chart.config.autofilter = chart.config.filters.length > 0 ? false : chart.config.autofilter == null ? defaultSettings$1.autofilter : chart.config.autofilter;

		/********************* Group Settings *********************/
		chart.config.groups = chart.config.groups || defaultSettings$1.groups;

		//autogroups - don't use automatic groups if user specifies groups object
		chart.config.autogroups = chart.config.groups.length > 0 ? false : chart.config.autogroups == null ? defaultSettings$1.autogroups : chart.config.autogroups;
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
		createChart: createChart$1,
		createExplorer: createExplorer,
		createHistogram: createHistogram
	};

	return index;
}(webCharts);

