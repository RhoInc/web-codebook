import { select as d3select } from 'd3';

export function init(codebook) {
  codebook.settings.layout(codebook);
  for (const funk in codebook.settings.functionality)
    codebook.settings.functionality[funk](codebook);
}
