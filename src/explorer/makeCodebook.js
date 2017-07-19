import { csv as d3csv } from 'd3';
import { merge as d3merge } from 'd3';

export function makeCodebook(explorer) {
  explorer.codebookWrap.selectAll('*').remove();

  //add the Files section to the nav for each config
  this.current.settings.tabs = this.current.settings.tabs
    ? d3merge([['files'], this.current.settings.tabs])
    : ['files', 'codebook', 'listing', 'settings'];

  //set the default tab to the codebook or listing view assuming they are visible
  if (this.current.event == 'click') {
    this.current.settings.defaultTab = this.current.settings.tabs.indexOf(
      'codebook'
    ) > -1
      ? 'codebook'
      : this.current.settings.tabs.indexOf('listing') > -1
        ? 'listing'
        : 'files';
  }

  //create the codebook
  explorer.codebook = webcodebook.createCodebook(
    '.web-codebook-explorer .codebookWrap',
    this.current.settings
  );

  explorer.codebook.on('complete', function() {
    explorer.fileListing.init(explorer);
  });

  d3csv(this.current.path, function(error, data) {
    explorer.codebook.init(data);
  });
}
