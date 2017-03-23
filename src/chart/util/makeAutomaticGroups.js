export function makeAutomaticGroups(chart) {
	//make groups for all categorical variables with less than autofilter levels
	if(chart.config.autogroups>1){
		var autogroups = chart.data.summary
		.filter(f=>f.type=="categorical") //categorical filters only
		.filter(f=>f.statistics.values.length <= chart.config.autogroups)//no groups
		.filter(f=>f.statistics.values.length > 1) //no silly 1 item groups 
		.map(function(m){return {value_col:m.value_col}})

		chart.config.groups = autogroups.length > 0 ? autogroups : null;
	}
}
