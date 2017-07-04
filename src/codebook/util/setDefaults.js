import defaultSettings from '../defaultSettings';

export function setDefaults(codebook) {
  /********************* Filter Settings *********************/
  codebook.config.filters = codebook.config.filters || defaultSettings.filters;
  codebook.config.filters = codebook.config.filters.map(function(d) {
    if (typeof d == 'string') return { value_col: d };
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
    if (typeof d == 'string') return { value_col: d };
    else return d;
  });

  /********************* Variable Label Settings *********************/
  codebook.config.variableLabels =
    codebook.config.variableLabels || defaultSettings.variableLabels;
  codebook.config.variableLabels = codebook.config.variableLabels.filter(
    (label, i) => {
      const is_object = typeof label === 'object',
        has_value_col = label.hasOwnProperty('value_col'),
        has_label = label.hasOwnProperty('label'),
        legit = is_object && has_value_col && has_label;
      if (!legit)
        console.warn(
          `Item ${i} of settings.variableLabels (${JSON.stringify(
            label
          )}) must be an object with both a "value_col" and a "label" property.`
        );

      return legit;
    }
  );

  //autogroups - don't use automatic groups if user specifies groups object
  codebook.config.autogroups = codebook.config.groups.length > 0
    ? false
    : codebook.config.autogroups == null
      ? defaultSettings.autogroups
      : codebook.config.autogroups;

  /********************* Hidden Variable Settings ***************/
  codebook.config.hiddenVariables =
    codebook.config.hiddenVariables || defaultSettings.hiddenVariables;
  codebook.config.hiddenVariables.push('web-codebook-index'); // internal variables should always be hidden

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

  /********************* Nav Settings *********************/
  codebook.config.tabs = codebook.config.tabs || defaultSettings.tabs;
  codebook.config.defaultTab =
    codebook.config.defaultTab || codebook.config.tabs[0];
  if (codebook.config.tabs.indexOf(codebook.config.defaultTab) == -1) {
    console.warn(
      "Invalid starting tab of '" +
        codebook.config.defaultTab +
        "' specified. Using '" +
        codebook.config.tabs[0] +
        "' instead."
    );
    codebook.config.defaultTab = codebook.config.tabs[0];
  }
}
