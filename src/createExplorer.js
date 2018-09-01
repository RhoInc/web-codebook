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

  return explorer;
}
