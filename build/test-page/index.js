//Load local build if in local environment.
if (window.origin !== 'https://rhoinc.github.io') {
    var head = document.getElementsByTagName('head')[0];

  //...load local build.
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '../webcodebook.js';
    head.appendChild(script);

  //...load local stylesheet.
    for (var i = 0; i < document.styleSheets.length; i++) {
        var styleSheet = document.styleSheets[i];
        if (styleSheet.href.indexOf('webcodebook') > -1)
            styleSheet.disabled = true;
    }
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = '../../css/webcodebook.css';
    head.appendChild(link);   head.appendChild(script);
}

d3.csv(
    'https://rawgit.com/RhoInc/viz-library/master/data/testData/ADTIMELINES_partialMissing.csv',
    function(error,data) {
        if (error)
            console.log(error);

        var settings = {
            chartVisibility: 'visible',
            meta:[
              {
                value_col:"USUBJID",
                label:"Subject ID",
                description: "Unique Identifier"
              }
            ]
        };
        var instance = webcodebook.createCodebook(
            '#container',
            settings
        );
        instance.init(data);
    }
);
