import { init } from './explorer/init';
import { layout } from './explorer/layout';
import { fileListing } from './explorer/fileListing';
import { makeCodebook } from './explorer/makeCodebook';
import { addFiles } from './explorer/addFiles';

export function createExplorer(element = 'body', config) {
  let explorer = {
    element: element,
    config: config,
    init: init,
    layout: layout,
    fileListing: fileListing,
    makeCodebook: makeCodebook,
    addFiles: addFiles
  };

  return explorer;
}
