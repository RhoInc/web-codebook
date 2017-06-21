export function makeAutomaticGroups(codebook) {
  //make groups for all categorical variables with less than autofilter levels
  if (codebook.config.autogroups > 1) {
    var autogroups = codebook.data.summary
      .filter(f => f.type == "categorical") //categorical filters only
      .filter(f => f.statistics.values.length <= codebook.config.autogroups) //no groups
      .filter(f => f.statistics.values.length > 1) //no silly 1 item groups
      .map(function(m) {
        return { value_col: m.value_col };
      });

    codebook.config.groups = autogroups.length > 0 ? autogroups : null;
  }
  codebook.data.summary
    .forEach(variable => {
        variable.groupOption = codebook.config.groups
            .map(group => group.value_col)
            .indexOf(variable.value_col) > -1;
    });
}
