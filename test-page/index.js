document.onreadystatechange = function() {
  if (document.readyState === 'complete') {
    d3.csv(
      'https://rawgit.com/RhoInc/viz-library/master/data/testData/ADTIMELINES_partialMissing.csv',
      function(error, data) {
        if (error) console.log(error);

        var settings = {
          //    chartVisibility: 'hidden',
          meta: [
            {
              value_col: 'USUBJID',
              label: 'Subject ID',
              description: 'Unique Identifier'
            }
          ]
        };
        var instance = webcodebook.createCodebook('#container', settings);
        instance.init(data);
      }
    );
  }
};
