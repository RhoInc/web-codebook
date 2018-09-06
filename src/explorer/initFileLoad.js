import { addFile } from './addFile';

export function initFileLoad() {
  //draw the control
  var explorer = this;
  explorer.dataFileLoad = {};
  explorer.dataFileLoad.wrap = explorer.codebook.fileListing.wrap
    .insert('div', '*')
    .attr('class', 'dataLoader');

  explorer.dataFileLoad.wrap.append('span').text('Add a local .csv file: ');

  explorer.dataFileLoad.loader_wrap = explorer.dataFileLoad.wrap
    .append('label')
    .attr('class', 'file-load-label');

  explorer.dataFileLoad.loader_label = explorer.dataFileLoad.loader_wrap
    .append('span')
    .text('Choose a File');

  explorer.dataFileLoad.loader_input = explorer.dataFileLoad.loader_wrap
    .append('input')
    .attr('type', 'file')
    .attr('class', 'file-load-input')
    .on('change', function() {
      var files = this.files;
      explorer.dataFileLoad.loader_label.text(files[0].name);

      if (this.value.slice(-4).toLowerCase() == '.csv') {
        loadStatus.text(' loading ...').style('color', 'green');
        var fr = new FileReader();
        fr.onload = function(e) {
          // get the current date/time
          var d = new Date();
          var n = d3.time.format('%X')(d);

          addFile.call(explorer, files[0].name, e.target.result);

          //clear the file input
          loadStatus.text('Loaded.').style('color', 'green');
          explorer.dataFileLoad.loader_input.property('value', '');
        };

        fr.readAsText(files.item(0));
      } else {
        loadStatus.text("Can't Load. File is not a csv.").style('color', 'red');
      }
    });

  var loadStatus = explorer.dataFileLoad.wrap
    .append('span')
    .attr('class', 'loadStatus')
    .text('');

  loadStatus
    .append('sup')
    .html('&#9432;')
    .property(
      'title',
      'Create a codebook for a local file. File is added to the data set list, and is only available for a single session and is not saved.'
    )
    .style('cursor', 'help');
}
