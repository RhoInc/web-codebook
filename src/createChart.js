import { init } from './chart/init';
import { layout } from './chart/layout';
import { controls } from './chart/controls';
import { summaryTable } from './chart/summaryTable';
import { util } from './chart/util';
import { data } from './chart/data';


export function createChart(element = 'body', config) {
    let chart =
        {element: element
        ,config:  config
        ,init: init
        ,layout: layout
        ,controls: controls
        ,summaryTable: summaryTable
        ,data:data
        ,util: util};

    return chart;
}
