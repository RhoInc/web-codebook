const defaultSettings = {
  filters: [],
  groups: [],
  variableLabels: [],
  hiddenVariables: [],
  meta: [],
  autogroups: 5, //automatically include categorical vars with 2-5 levels in the groups dropdown
  autofilter: 10, //automatically make filters for categorical variables with 2-10 levels
  autobins: true,
  nBins: 100,
  levelSplit: 5, //cutpoint for # of levels to use levelPlot() renderer
  controlVisibility: 'visible',
  chartVisibility: 'minimized',
  tabs: ['codebook', 'listing', 'chartMaker', 'settings'],
  dataName: ''
};

export default defaultSettings;
