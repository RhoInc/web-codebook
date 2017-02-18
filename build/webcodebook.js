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

		filterLabel.append("span").html(d => d.label || d.value_col);

		var filterCustom = filterItem.append('select').attr('multiple', true);

		//Add data-driven filter options.
		var filterItems = filterCustom.selectAll('option').data(function (d) {
			return d.values;
		}).enter().append('option').html(function (d) {
			return d.value;
		}).attr('value', function (d) {
			return d.value;
		}).attr('selected', d => d.selected ? 'selected' : null);

		//Initialize event listeners
		filterCustom.on('change', function () {
			console.log('filtering');

			// flag the selected options in the config
			d3.select(this).selectAll('option').each(function (option_d) {
				option_d.selected = d3.select(this).property('selected');
			});

			chart.data.filtered = chart.data.makeFiltered(chart.data.raw, chart.config.filters);
			console.log(chart.data.raw.length + "->" + chart.data.filtered.length);
			chart.data.summary = chart.data.makeSummary(chart.data.filtered);
			chart.summaryTable.draw(chart);
		});
	}

	const filters = { init: init$2 };

	const controls = {
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
		//enter/update/exit for variableDivs
		console.log(chart.data.summary);

		//BIND the newest data
		var varRows = chart.summaryTable.wrap.selectAll("div.variable-row").data(chart.data.summary, d => d.value_col);

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
		const margin = { left: 100,
			right: 25 };
		const aspect = 3;
		if (d.type === 'categorical') {
			//Categorical - Dot plot//
			const data = d.statistics.values.sort((a, b) => a.prop_n > b.prop_n ? -2 : a.prop_n < b.prop_n ? 2 : a.key < b.key ? -1 : 1).slice(0, 5);
			const webChartContainer = d3.select(this).node();
			const webChartSettings = { x: { column: 'prop_n',
					type: 'linear',
					label: '',
					format: '%',
					domain: [0, 1] },
				y: { column: 'key',
					type: 'ordinal',
					label: '',
					order: data.map(d => d.key).reverse() },
				marks: [{ type: 'circle',
					per: ['key'],
					summarizeX: 'mean',
					tooltip: '[key]: [n] ([prop_n])' }],
				gridlines: 'xy',
				resizable: true,
				aspect: aspect,
				margin: margin
			};
			const webChart = new webCharts.createChart(webChartContainer, webChartSettings);

			webChart.init(data);
		} else {
			//CONTINUOUS - Histogram//
			const data = d.values;
			data.forEach((d, i) => {
				data[i] = { value: d };
			});
			const webChartContainer = d3.select(this).node();
			const webChartSettings = { x: { column: 'value',
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
			const webChart = new webCharts.createChart(webChartContainer, webChartSettings);

			webChart.init(data);
		}
	}

	function makeDetails(d) {
		var wrap = d3.select(this);
		//Render Variable Name/Type
		var title = wrap.append("div").html(d => d.value_col + " <span class='small'>" + d.type + "</span>");

		//Render Summary Stats
		var stats_div = wrap.append("div").attr("class", "stat-row");
		var statNames = Object.keys(d.statistics).filter(f => f != "values");
		var statList = statNames.map(function (stat) {
			return { key: stat, value: d.statistics[stat] };
		});

		var stats = stats_div.selectAll("div").data(statList).enter().append("div").attr('class', "stat");
		stats.append("div").text(d => d.key).attr("class", "label");
		stats.append("div").text(d => d.value).attr("class", "value");

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
		console.log("rendering row for" + d.value_col);
		var rowWrap = d3.select(this);
		rowWrap.selectAll("*").remove();
		rowWrap.append("div").attr("class", "row-overview section").each(makeOverview);
		rowWrap.append("div").attr("class", "row-details section").each(makeDetails);
	}

	const summaryTable = { init: init$3,
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
				statistics.mean = d3.format('0.2f')(d3.mean(nonMissing));
				statistics.SD = d3.format('0.2f')(d3.deviation(nonMissing));
				const quantiles = [['min', 0], ['5th percentile', .05], ['1st quartile', .25], ['median', .5], ['3rd quartile', .75], ['95th percentile', .95], ['max', 1]];
				quantiles.forEach(quantile => {
					let statistic = quantile[0];
					statistics[statistic] = d3.format('0.1f')(d3.quantile(nonMissing, quantile[1]));
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

	function makeFiltered(data, filters) {
		var filtered = data;
		filters.forEach(function (filter_d) {
			//remove the filtered values from the data based on the filters
			filtered = filtered.filter(function (rowData) {
				var currentValues = filter_d.values.filter(f => f.selected).map(m => m.value);
				return currentValues.indexOf(rowData[filter_d.value_col]) > -1;
			});
		});
		return filtered;
	}

	const data = {
		makeSummary: makeSummary,
		makeFiltered: makeFiltered

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

