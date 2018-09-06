import { csv as d3csv } from 'd3';
import { merge as d3merge } from 'd3';
import { initFileLoad } from './initFileLoad';

export function makeCodebook(explorer) {
  explorer.codebookWrap.selectAll('*').remove();

  //add the Files section to the nav for each config
  this.current.settings.tabs = this.current.settings.tabs
    ? d3merge([['files'], this.current.settings.tabs])
    : ['files', 'codebook', 'listing', 'chartMaker', 'settings'];

  //set the default tab to the codebook or listing view assuming they are visible
  if (this.current.event == 'click') {
    this.current.settings.defaultTab =
      this.current.settings.tabs
        .map(tab => (tab.key ? tab.key : tab))
        .indexOf('codebook') > -1
        ? 'codebook'
        : this.current.settings.tabs.indexOf('listing') > -1
          ? 'listing'
          : 'files';
  }

  this.current.settings.dataName =
    '"' + this.current[this.config.labelColumn] + '"';

  //reset the group to null (only matters the 2nd time the file is clicked)
  delete this.current.settings.group;

  //pass along any relevant column metadata
  this.current.settings.meta = explorer.config.meta.filter(
    f => f.file == this.current[this.config.labelColumn]
  );

  //create the codebook
  explorer.codebook = webcodebook.createCodebook(
    '.web-codebook-explorer .codebookWrap',
    this.current.settings
  );

  explorer.codebook.on('complete', function() {
    explorer.fileListing.init(explorer);
    if (explorer.config.fileLoader) {
      initFileLoad.call(explorer);
    }
  });

  if (this.current.json) {
    explorer.codebook.init(this.current.json);
  } else if (this.current.path) {
    d3csv(this.current.path, function(error, data) {
      explorer.codebook.init(data);
    });
  } else {
    alert('No data provided for the selected file.');
  }

  //call the makeCodebook event (if any)
  explorer.events.makeCodebook.call(this);
}
