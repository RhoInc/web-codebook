function cleanData() {
  var explorer = this;
  var config = this.config;

  config.meta.forEach(function(f) {
    f.file = f.Form + '.csv';
    f.label = f.Label;
  });

  config.files.forEach(function(f) {
    f.path =
      'https://rawgit.com/RhoInc/viz-library/master' + f.rel_path.slice(1);
    f.shortname = f.filename.replace(/\.[^/.]+$/, '');
    if (config.metaFiles.indexOf(f.shortname) > -1) {
      f.meta = config.meta.filter(m => m.Form == f.shortname).map(function(m) {
        m.value_col = m.Variable;
        return m;
      });

      f['Metadata included?'] = 'Yes';
    } else {
      f['Metadata included?'] = 'No';
    }
    return f;
  });
}

function initExplorer(fileList, settings) {
  d3.csv(
    'https://rawgit.com/RhoInc/viz-library/master/data/safetyData/variableMetaData.csv',
    function(error, meta) {
      settings.meta = meta;
      settings.files = fileList;

      var explorer = webcodebook.createExplorer('#container', settings);
      explorer.on('init', cleanData);
      explorer.on('addFile', function() {
        console.log(this.newFileObject);
      });
      explorer.on('makeCodebook', function() {
        console.log(this.current);
      });
      explorer.init();
    }
  );
}

var settings = {
  labelColumn: 'filename',
  ignoredColumns: ['local_path', 'rel_path', 'path'],
  fileLoader: true,
  metaFiles: ['AE', 'DM', 'LB'],
  defaultCodebookSettings: {
    autogroups: 2
  }
};

document.onreadystatechange = function() {
  initExplorer(dataFiles, settings);
  d3.select('body')
    .append('p')
    .text('Settings:');
  d3.select('body')
    .append('textarea')
    .property('rows', '10')
    .property('cols', '100')
    .property('value', JSON.stringify(settings))
    .on('change', function() {
      delete explorer;
      d3.select('#container')
        .selectAll('*')
        .remove();
      initExplorer(dataFiles, JSON.parse(this.value));
    });
};
