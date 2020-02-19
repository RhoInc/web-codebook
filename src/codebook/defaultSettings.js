const defaultSettings = {
  filters: [],
  groups: [],
  variableLabels: [],
  variableTypes: [],
  hiddenVariables: [],
  meta: [],
  autogroups: 5, //automatically include categorical vars with 2-5 levels in the groups dropdown
  autofilter: 10, //automatically make filters for categorical variables with 2-10 levels
  autobins: true,
  nBins: 100,
  levelSplit: 5, //cutpoint for # of levels to use levelPlot() renderer
  maxLevels: 100, //bar charts with more than maxLevels are hidden by default
  controlVisibility: 'visible',
  chartVisibility: 'minimized',
  tabs: ['codebook', 'listing', 'chartMaker', 'settings'],
  dataName: '',
  whiteSpaceAsMissing: true,
  missingValues: [null, NaN, undefined]
};

export default defaultSettings;
