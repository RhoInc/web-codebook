import defaultSettings from '../defaultSettings';
export function setDefaults(chart) {

	/********************* Filter Settings *********************/
    chart.config.filters = chart.config.filters || defaultSettings.filters
	
	//autofilter - don't use automatic filter if user specifies filters object
	chart.config.autofilter = chart.config.filters.length > 0 ? false :
		chart.config.autofilter == null ? 
		defaultSettings.autofilter : 
		chart.config.autofilter;

	/********************* Group Settings *********************/
	chart.config.groups = chart.config.groups || defaultSettings.groups;
	
	//autogroups - don't use automatic groups if user specifies groups object
	chart.config.autogroups = chart.config.groups.length > 0 ? false :
		chart.config.autogroups == null ? 
		defaultSettings.autogroups : 
		chart.config.autogroups;
}
