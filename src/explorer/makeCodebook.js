import { csv as d3csv } from 'd3';
import { merge as d3merge } from 'd3';

export function makeCodebook(meta) {
  this.codebookWrap.selectAll('*').remove();

  //add the Files section to the nav for each config
  meta.settings.tabs = meta.settings.tabs
    ? d3merge([['files'], meta.settings.tabs])
    : ['files', 'codebook', 'listing', 'settings'];

  var codebook = webcodebook.createCodebook(
    '.web-codebook-explorer .codebookWrap',
    meta.settings
  );
  d3csv(meta.path, function(error, data) {
    codebook.init(data);
  });
}
