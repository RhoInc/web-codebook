import { merge } from 'd3';

export function addFile(label, csv_raw) {
  var explorer = this;

  // parse the file object
  var newFileObject = {};
  newFileObject[explorer.config.labelColumn] = label;
  newFileObject.json = d3.csv.parse(csv_raw);
  newFileObject.settings = {};

  //customize the data object if the user provides a function
  if (explorer.config.customFileLoad) {
    explorer.config.customFileLoad(newFileObject);
  }

  //remove duplicates
  //  var newFiles = files.filter(function(f) {
  //    return explorer.config.files.indexOf(f) == -1;
  //  });

  //add new files to file list
  this.config.files = merge([[newFileObject], this.config.files]);

  //re-draw the file listing
  explorer.codebook.fileListing.table.draw(this.config.files);
}
