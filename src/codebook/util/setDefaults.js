import defaultSettings from '../defaultSettings';
import availableTabs from '../nav/availableTabs';

export function setDefaults(codebook) {
  /**************** Column Metadata ************/
  codebook.config.meta = codebook.config.meta || defaultSettings.meta;

  // If labels are specified in the metadata, use them as the default
  if (codebook.config.meta.length) {
    var metaLabels = [];
    codebook.config.meta.forEach(function(m) {
      var mKeys = Object.keys(m);
      if ((mKeys.indexOf('value_col') > -1) & (mKeys.indexOf('label') > -1)) {
        metaLabels.push({ value_col: m['value_col'], label: m['label'] });
      }
    });
    defaultSettings.variableLabels = metaLabels;
  }

  /********************* Filter Settings *********************/
  codebook.config.filters = codebook.config.filters || defaultSettings.filters;
  codebook.config.filters = codebook.config.filters.map(function(d) {
    if (typeof d == 'string') return { value_col: d };
    else return d;
  });

  //autofilter - don't use automatic filter if user specifies filters object
  codebook.config.autofilter =
    codebook.config.filters.length > 0
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

  //check any user specified labels to make sure they are in the correct format
  codebook.config.variableLabels = codebook.config.variableLabels || [];
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

  if (
    codebook.config.variableLabels.length &&
    defaultSettings.variableLabels.length
  ) {
    //merge the defaults with the user specified labels if both are populated
    var userLabelVars = codebook.config.variableLabels.map(m => m.value_col);

    //Keep the default label if the user hasn't specified a label for the column
    defaultSettings.variableLabels.forEach(function(defaultLabel) {
      if (userLabelVars.indexOf(defaultLabel.value_col) == -1) {
        codebook.config.variableLabels.push(defaultLabel);
      }
    });
  } else {
    codebook.config.variableLabels = codebook.config.variableLabels.length
      ? codebook.config.variableLabels
      : defaultSettings.variableLabels;
  }
  //autogroups - don't use automatic groups if user specifies groups object
  codebook.config.autogroups =
    codebook.config.groups.length > 0
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
  codebook.config.autobins =
    codebook.config.autobins == null
      ? defaultSettings.autobins
      : codebook.config.autobins;

  codebook.config.levelSplit =
    codebook.config.levelSplit || defaultSettings.levelSplit;

  /********************* Nav Settings *********************/
  codebook.config.tabs = codebook.config.tabs || defaultSettings.tabs;
  codebook.config.tabs = codebook.config.tabs.map(function(d) {
    if (typeof d == 'string') return { key: d };
    else return d;
  });

  codebook.config.defaultTab =
    codebook.config.defaultTab || codebook.config.tabs[0].key;
  if (
    codebook.config.tabs.map(m => m.key).indexOf(codebook.config.defaultTab) ==
    -1
  ) {
    console.warn(
      "Invalid starting tab of '" +
        codebook.config.defaultTab +
        "' specified. Using '" +
        codebook.config.tabs[0] +
        "' instead."
    );
    codebook.config.defaultTab = codebook.config.tabs[0].key;
  }

  /********************* Missing Value Settings *********************/
  codebook.config.whiteSpaceAsMissing =
    codebook.config.whiteSpaceAsMissing || defaultSettings.whiteSpaceAsMissing;

  codebook.config.missingValues =
    codebook.config.missingValues || defaultSettings.missingValues;

  /********************* Control Visibility Settings *********************/
  codebook.config.controlVisibility =
    codebook.config.controlVisibility || defaultSettings.controlVisibility;

  /********************* Chart Visibility Settings *********************/
  codebook.config.chartVisibility =
    codebook.config.chartVisibility || defaultSettings.chartVisibility;

  //hide the controls appropriately according to the start tab
  if (codebook.config.controlVisibility !== 'disabled') {
    var startTab = availableTabs.find(f => f.key == codebook.config.defaultTab);
    codebook.config.controlVisibility = startTab.controls
      ? codebook.config.controlVisibility
      : 'hidden';
  }
}
