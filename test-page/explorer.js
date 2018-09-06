document.onreadystatechange = function() {
  function initExplorer(fileList) {
    var metaFiles = ['AE', 'DM', 'LB']; //list of files to add meta data
    d3.csv(
      'https://rawgit.com/RhoInc/viz-library/master/data/safetyData/variableMetaData.csv',
      function(error, meta) {
        meta.forEach(function(f) {
          f.file = f.Form + '.csv';
          f.label = f.Label;
        });

        var fileList_clean = fileList.map(function(f) {
          f.path =
            'https://rawgit.com/RhoInc/viz-library/master' +
            f.rel_path.slice(1);
          f.shortname = f.filename.replace(/\.[^/.]+$/, '');
          if (metaFiles.indexOf(f.shortname) > -1) {
            f.meta = meta.filter(m => m.Form == f.shortname).map(function(m) {
              m.value_col = m.Variable;
              return m;
            });
            f['Metadata included?'] = 'Yes';
          } else {
            f['Metadata included?'] = 'No';
          }
          return f;
        });
        var settings = {
          labelColumn: 'filename',
          ignoredColumns: ['local_path', 'rel_path', 'path'],
          files: fileList_clean,
          meta: meta,
          fileLoader: true
        };
        var explorer = webcodebook
          .createExplorer('#container', settings)
          .init();
      }
    );
  }

  initExplorer(dataFiles);
};
