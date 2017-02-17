var webcodebook = function () {
    'use strict';

    /*------------------------------------------------------------------------------------------------\
      Initialize codebook
    \------------------------------------------------------------------------------------------------*/

    function init(data) {
        console.log("initializing!");
    }

    /*------------------------------------------------------------------------------------------------\
      Generate HTML containers.
    \------------------------------------------------------------------------------------------------*/

    function layout() {
        var wrapper = this.wrap.append('div').attr('class', 'web-codebook').append('div').attr('class', 'table-wrapper');
        wrapper.append('div').attr('class', 'controls');
        wrapper.append('div').attr('class', 'summaryTable');
    }

    function init$1(chart) {}

    const controls = {
        init: init$1
    };

    /*------------------------------------------------------------------------------------------------\
    intialize the summary table
    \------------------------------------------------------------------------------------------------*/

    function init$2(chart) {}

    /*------------------------------------------------------------------------------------------------\
      draw/update the summaryTable
    \------------------------------------------------------------------------------------------------*/

    function draw(chart) {}

    /*------------------------------------------------------------------------------------------------\
      destroy the summary table
    \------------------------------------------------------------------------------------------------*/

    function destroy(chart) {}

    const summaryTable = { init: init$2,
        draw: draw,
        destroy: destroy
    };

    /*------------------------------------------------------------------------------------------------\
      Define util object.
    \------------------------------------------------------------------------------------------------*/

    const util = {};

    function createChart(element = 'body', config) {
        let chart = { element: element,
            config: config,
            init: init,
            layout: layout,
            controls: controls,
            summaryTable: summaryTable,
            util: util };

        return chart;
    }

    var index = {
        createChart
    };

    return index;
}();

