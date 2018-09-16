document.onreadystatechange = function() {
  if (document.readyState === 'complete') {
    d3.csv('./ADTIMELINES_partialMissing.csv', function(error, data) {
      if (error) console.log(error);

      var settings = {
        //    chartVisibility: 'hidden',
        //autogroups: 3,
        groups: ['SEX'],
        meta: [
          {
            value_col: 'USUBJID',
            label: 'Subject ID',
            description: 'Unique Identifier',
            Type: 'categorical'
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
    });
  }
};