var webcodebook = function () {
    'use strict';

    /*------------------------------------------------------------------------------------------------\
      Initialize codebook
    \------------------------------------------------------------------------------------------------*/

    function init(data) {
        var settings = this.config;

        //create chart wrapper in specified div
        this.wrap = d3.select(this.element).append('div');
        this.wrap.attr("class", "web-codebook");

        //save raw data
        this.raw_data = data;

        //settings and defaults
        this.util.setDefaults(this);
        this.layout();

        //prepare the data summaries

        //draw controls

        //initialize and then draw the codebook
        this.summaryTable.init();
        this.summaryTable.draw();
    }

    /*------------------------------------------------------------------------------------------------\
      Generate HTML containers.
    \------------------------------------------------------------------------------------------------*/

    function layout() {
        this.controls.wrap = this.wrap.append('div').attr('class', 'controls');
        this.table.wrap = this.wrap.append('div').attr('class', 'summaryTable');
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

    function draw(chart) {
        console.log(chart);
    }

    /*------------------------------------------------------------------------------------------------\
      destroy the summary table
    \------------------------------------------------------------------------------------------------*/

    function destroy(chart) {}

    const summaryTable = { init: init$2,
        draw: draw,
        destroy: destroy
    };

    function setDefaults(chart) {}

    const util = {
        setDefaults: setDefaults
    };

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

