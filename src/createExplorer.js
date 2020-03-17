import { init } from './explorer/init';
import { layout } from './explorer/layout';
import { fileListing } from './explorer/fileListing';
import { makeCodebook } from './explorer/makeCodebook';
import { addFile } from './explorer/addFile';

export function createExplorer(element = 'body', config) {
    let explorer = {
        element: element,
        config: config,
        init: init,
        layout: layout,
        fileListing: fileListing,
        makeCodebook: makeCodebook,
        addFile: addFile
    };

    explorer.events = {
        init() {},
        addFile() {},
        makeCodebook() {}
    };

    explorer.on = function(event, callback) {
        let possible_events = ['init', 'addFile', 'makeCodebook'];
        if (possible_events.indexOf(event) < 0) {
            return;
        }
        if (callback) {
            explorer.events[event] = callback;
        }
    };

    return explorer;
}
