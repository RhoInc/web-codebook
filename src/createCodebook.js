import { init } from "./codebook/init";
import { layout } from "./codebook/layout";
import { controls } from "./codebook/controls";
import { nav } from "./codebook/nav";
import { summaryTable } from "./codebook/summaryTable";
import { dataListing } from "./codebook/dataListing";
import { util } from "./codebook/util";
import { data } from "./codebook/data";

export function createCodebook(element = "body", config) {
  let codebook = {
    element: element,
    config: config,
    init: init,
    layout: layout,
    controls: controls,
    nav: nav,
    summaryTable: summaryTable,
    dataListing: dataListing,
    data: data,
    util: util
  };

  return codebook;
}
