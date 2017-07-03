// determine the number of bins to use in the histogram based on the data.
// Based on an implementation of the Freedman-Diaconis
// See https://en.wikipedia.org/wiki/Freedman%E2%80%93Diaconis_rule for more
// values should be an array of numbers

import defaultSettings from '../defaultSettings';

export function getBinCounts(codebook) {
  //function to set the bin count for a single variable
  function setBinCount(summaryData) {
    //Freedman-Diaconis rule - returns the recommended bin size for a histogram
    function FreedmanDiaconis(IQR, n) {
      var cubeRootN = Math.pow(n, 1.0 / 3.0);
      return 2 * (IQR / cubeRootN);
    }

    var IQR =
      +summaryData.statistics['3rd quartile'] -
      +summaryData.statistics['1st quartile'];
    var n = summaryData.statistics['n'];
    var range = +summaryData.statistics['max'] - +summaryData.statistics['min'];
    var binSize = FreedmanDiaconis(IQR, n);
    var bins = binSize > 0
      ? Math.ceil(range / binSize)
      : codebook.config.nBins > 0
        ? codebook.config.nBins
        : defaultSettings.nBins;

    return bins;
  }

  var continuousVars = codebook.data.summary.filter(
    d => d.type == 'continuous'
  );
  continuousVars.forEach(function(cvar) {
    cvar.bins = codebook.config.autoBins
      ? codebook.config.nBins
      : setBinCount(cvar);
    if (Object.keys(codebook.config).indexOf('group') > -1) {
      cvar.groups.forEach(function(gvar) {
        gvar.bins = codebook.config.autoBins
          ? codebook.config.nBins
          : setBinCount(gvar);
      });
    }
  });
}
