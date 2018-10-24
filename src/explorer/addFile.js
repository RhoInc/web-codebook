import { csv, merge } from 'd3';

export function addFile(label, csv_raw) {
  var explorer = this;

  // parse the file object
  this.newFileObject = {};
  this.newFileObject[explorer.config.labelColumn] = label;
  this.newFileObject.json = csv.parse(csv_raw);
  this.newFileObject.settings = {};
  this.newFileObject.fileID = explorer.config.files.length + 1;

  //call the addFile event (if any)
  explorer.events.addFile.call(this);

  //add new files to file list
  this.config.files = merge([[explorer.newFileObject], this.config.files]);

  //re-draw the file listing
  explorer.codebook.fileListing.table.draw(this.config.files);
}
