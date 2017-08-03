import { select as d3select } from 'd3';
import indicateLoading from '../util/indicateLoading';

export function init(codebook) {
  indicateLoading(codebook, '.web-codebook .settings .column-table');

  codebook.settings.layout(codebook);
}
