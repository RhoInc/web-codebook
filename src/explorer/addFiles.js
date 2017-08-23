export function addFiles(files) {
  var explorer = this;
  //remove duplicates
  var newFiles = files.filter(function(f) {
    return explorer.config.files.indexOf(f) == -1;
  });
  console.log(newFiles);
  //add new files to file list
  this.config.files = d3.merge([this.config.files, newFiles]);

  //re-draw the file listing
  explorer.codebook.fileListing.table.draw(this.config.files);

  console.log('added files?');
  console.log(explorer);
}
