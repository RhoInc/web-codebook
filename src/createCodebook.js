import { init } from './codebook/init';
import { layout } from './codebook/layout';
import { controls } from './codebook/controls';
import { nav } from './codebook/nav';
import { summaryTable } from './codebook/summaryTable';
import { dataListing } from './codebook/dataListing';
import { chartMaker } from './codebook/chartMaker';
import { util } from './codebook/util';
import { data } from './codebook/data';
import { settings } from './codebook/settings';
import { title } from './codebook/title';
import { instructions } from './codebook/instructions';
import clone from './util/clone';

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
    chartMaker: chartMaker,
    data: data,
    util: util,
    settings: settings
  };

  var cbClone = clone(codebook);
  cbClone.events = {
    init() {},
    complete() {}
  };

  cbClone.on = function(event, callback) {
    let possible_events = ['init', 'complete'];
    if (possible_events.indexOf(event) < 0) {
      return;
    }
    if (callback) {
      cbClone.events[event] = callback;
    }
  };

  return cbClone;
}
