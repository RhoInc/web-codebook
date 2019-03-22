d3.csv(
  'https://rawgit.com/RhoInc/viz-library/master/data/testData/ADTIMELINES_partialMissing.csv',
  function(d) {
    return d;
  },
  function(error, data) {
    if (error) console.log(error);

    var settings = {
      //        chartVisibility: 'hidden',
      //autogroups: 3,
      groups: ['SEX'],
      meta: [
        {
          value_col: 'USUBJID',
          label: 'Subject ID',
          description: 'Unique Identifier',
          type: 'categorical'
        },
        {
          value_col: 'SITEID',
          label: 'Site ID',
          type: 'continuous'
        }
      ]
    };
    var instance = webcodebook.createCodebook('#container', settings);
    instance.init(data);
  }
);
