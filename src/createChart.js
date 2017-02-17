import { init } from './chart/init';
import { layout } from './chart/layout';
import { controls } from './chart/controls';
import { summaryTable } from './chart/summaryTable';
import { util } from './chart/util';

export function createChart(element = 'body', config) {
    let chart =
        {element: element
        ,config:  config
        ,init: init
        ,layout: layout
        ,controls: controls
        ,summaryTable: summaryTable
        ,util: util};

    return chart;
}
