import { select as d3select } from 'd3';
import indicateLoading from '../util/indicateLoading';

export function init(codebook) {
  indicateLoading(codebook, () => {
    codebook.settings.layout(codebook);
  });
}
