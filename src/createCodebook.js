import { init } from './codebook/init';
import { layout } from './codebook/layout';
import { controls } from './codebook/controls';
import { nav } from './codebook/nav';
import { summaryTable } from './codebook/summaryTable';
import { dataListing } from './codebook/dataListing';
import { util } from './codebook/util';
import { data } from './codebook/data';
import { settings } from './codebook/settings';
import { title } from './codebook/title';
import { instructions } from './codebook/instructions';

export function createCodebook(element = 'body', config) {
  let codebook = {
    element: element,
    config: config,
    init: init,
    layout: layout,
    controls: controls,
    title: title,
    nav: nav,
    instructions: instructions,
    summaryTable: summaryTable,
    dataListing: dataListing,
    data: data,
    util: util,
    settings: settings
  };

  return codebook;
}
