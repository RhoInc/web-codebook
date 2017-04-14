export function makeAutomaticFilters(chart) {
  //make filters for all categorical variables with less than autofilter levels
  if (chart.config.autofilter > 1) {
    var autofilters = chart.data.summary
      .filter(f => f.type == "categorical") //categorical filters only
      .filter(f => f.statistics.values.length <= chart.config.autofilter) //no huge filters
      .filter(f => f.statistics.values.length > 1) //no silly 1 item filters
      .map(function(m) {
        return { value_col: m.value_col };
      });

    chart.config.filters = autofilters.length > 0 ? autofilters : null;
  }
}
