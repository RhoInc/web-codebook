import { csv as d3csv } from 'd3';
import { merge as d3merge } from 'd3';

export function makeCodebook(explorer, meta) {
  explorer.codebookWrap.selectAll('*').remove();

  //add the Files section to the nav for each config
  meta.settings.tabs = meta.settings.tabs
    ? d3merge([['files'], meta.settings.tabs])
    : ['files', 'codebook', 'listing', 'settings'];

  explorer.codebook = webcodebook.createCodebook(
    '.web-codebook-explorer .codebookWrap',
    meta.settings
  );

  explorer.codebook.on('init', function() {
    console.log('init fired');
  });

  explorer.codebook.on('complete', function() {
    console.log('complete fired');
    explorer.fileListing.init(explorer, meta);
  });

  d3csv(meta.path, function(error, data) {
    explorer.codebook.init(data);
  });
}
