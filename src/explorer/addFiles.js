import { merge } from 'd3';

export function addFiles(files) {
  var explorer = this;
  //remove duplicates
  var newFiles = files.filter(function(f) {
    return explorer.config.files.indexOf(f) == -1;
  });

  //add new files to file list
  this.config.files = merge([this.config.files, newFiles]);

  //re-draw the file listing
  explorer.codebook.fileListing.table.draw(this.config.files);
}
