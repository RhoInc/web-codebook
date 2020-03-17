function cleanData() {
    var explorer = this;
    var config = this.config;

    config.files.forEach(function(f) {
        f.path =
            'https://raw.githubusercontent.com/RhoInc/data-library/master' +
            f.rel_path.slice(1);
        f.shortname = f.filename.replace(/\.[^/.]+$/, '');
        return f;
    });
}

function initExplorer(fileList, settings) {
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

var settings = {
    labelColumn: 'filename',
    ignoredColumns: ['local_path', 'rel_path', 'path'],
    fileLoader: true,
    metaFiles: ['ae', 'dm', 'lb'],
    defaultCodebookSettings: {
        autogroups: 2
    }
};

document.onreadystatechange = function() {
    d3.json(
        'https://raw.githubusercontent.com/RhoInc/data-library/master/dataFiles.json',
        function(error, dataFiles) {
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
        }
    );
};
