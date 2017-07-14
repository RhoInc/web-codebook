import { csv as d3csv } from 'd3';
import { merge as d3merge } from 'd3';

export function makeCodebook(explorer) {
  explorer.codebookWrap.selectAll('*').remove();

  //add the Files section to the nav for each config
  this.current.settings.tabs = this.current.settings.tabs
    ? d3merge([['files'], this.current.settings.tabs])
    : ['files', 'codebook', 'listing', 'settings'];

  explorer.codebook = webcodebook.createCodebook(
    '.web-codebook-explorer .codebookWrap',
    this.current.settings
  );

  explorer.codebook.on('init', function() {
    console.log('init fired');
  });

  explorer.codebook.on('complete', function() {
    console.log('complete fired');
    explorer.fileListing.init(explorer);
  });

  d3csv(this.current.path, function(error, data) {
    explorer.codebook.init(data);
  });
}
