export function makeAutomaticFilters(codebook) {
  //make filters for all categorical variables with less than autofilter levels
  if (codebook.config.autofilter > 1) {
    var autofilters = codebook.data.summary
      .filter(f => f.type == "categorical") //categorical filters only
      .filter(f => f.statistics.values.length <= codebook.config.autofilter) //no huge filters
      .filter(f => f.statistics.values.length > 1) //no silly 1 item filters
      .map(function(m) {
        return { value_col: m.value_col };
      });

    codebook.config.filters = autofilters.length > 0 ? autofilters : null;
  }
  codebook.data.summary.forEach(variable => {
    variable.filter =
      codebook.config.filters
        .map(filter => filter.value_col)
        .indexOf(variable.value_col) > -1;
  });
}
