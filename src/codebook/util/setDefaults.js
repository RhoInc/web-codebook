import defaultSettings from "../defaultSettings";

export function setDefaults(codebook) {
  /********************* Filter Settings *********************/
  codebook.config.filters = codebook.config.filters || defaultSettings.filters;
  codebook.config.filters = codebook.config.filters.map(function(d) {
    if (typeof d == "string") return { value_col: d };
    else return d;
  });

  //autofilter - don't use automatic filter if user specifies filters object
  codebook.config.autofilter = codebook.config.filters.length > 0
    ? false
    : codebook.config.autofilter == null
        ? defaultSettings.autofilter
        : codebook.config.autofilter;

  /********************* Group Settings *********************/
  codebook.config.groups = codebook.config.groups || defaultSettings.groups;
  codebook.config.groups = codebook.config.groups.map(function(d) {
    if (typeof d == "string") return { value_col: d };
    else return d;
  });

  //autogroups - don't use automatic groups if user specifies groups object
  codebook.config.autogroups = codebook.config.groups.length > 0
    ? false
    : codebook.config.autogroups == null
        ? defaultSettings.autogroups
        : codebook.config.autogroups;

  /********************* Histogram Settings *********************/
  codebook.config.nBins = codebook.config.nBins || defaultSettings.nBins;
  codebook.config.autobins = codebook.config.autobins == null
    ? defaultSettings.autobins
    : codebook.config.autobins;

  /********************* Histogram Settings *********************/
  codebook.config.levelSplit =
    codebook.config.levelSplit || defaultSettings.levelSplit;

  /********************* Histogram Settings *********************/
codebook.config.controlVisibility =
  codebook.config.controlVisibility || defaultSettings.controlVisibility;

}
