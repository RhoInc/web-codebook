import { init } from './explorer/init';
import { layout } from './explorer/layout';
import { controls } from './explorer/controls';
import { makeCodebook } from './explorer/makeCodebook';

export function createExplorer(element = 'body', config) {
    let explorer =
        {element: element
        ,config:  config
        ,init: init
        ,layout: layout
        ,controls: controls
        ,makeCodebook:makeCodebook
    };

    return explorer;
}
