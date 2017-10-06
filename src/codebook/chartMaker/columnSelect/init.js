/*------------------------------------------------------------------------------------------------\
  Initialize detail select
\------------------------------------------------------------------------------------------------*/
import { select as d3select } from 'd3';
import { initAxisSelect } from './initAxisSelect.js';
import { initPanelSelect } from './initPanelSelect.js';

export function init(codebook) {
  initAxisSelect(codebook);
  initPanelSelect(codebook);
}
