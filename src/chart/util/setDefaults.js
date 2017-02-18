import defaultSettings from '../defaultSettings';
export function setDefaults(chart) {

    chart.config.filters = chart.config.filters || defaultSettings.filters
	
	//autofilter - don't use automatic filter if user specifies filters object
	chart.config.autofilter = chart.config.filters.length > 0 ? false :
		chart.config.autofilter == null ? 
		defaultSettings.autofilter : 
		chart.config.autofilter;
}
