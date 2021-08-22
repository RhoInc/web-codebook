fetch(
  'https://raw.githubusercontent.com/RhoInc/data-library/master/dataFiles.json'
)
  .then(response => response.json())
  .then(json => {
    json.forEach(fileObj => {
      fileObj.github_url = `https://raw.githubusercontent.com/RhoInc/data-library/master/${fileObj.rel_path.replace(
        /^\.\//,
        ''
      )}`;
      fileObj.dataName = (/sdtm|adam/.test(fileObj.rel_path)
        ? fileObj.filename.toUpperCase()
        : fileObj.filename
            .split(/[_-]|(?=[A-Z])/)
            .map(str => {
              return /^ad(?!verse)/i.test(str)
                ? str.toUpperCase()
                : str.substring(0, 1).toUpperCase() +
                    str.substring(1).toLowerCase();
            })
            .join(' ')
      ).replace(/\.csv/i, '');
    });
    //const fileObj = json[Math.floor(Math.random() * json.length)];
    const fileObj = json[8];
    d3.csv(
      fileObj.github_url,
      function(d, i) {
        return d;
      },
      function(error, data) {
        if (error) {
          console.log(error);
          alert(`${fileObj.github_url} does not exist. Please reload page.`);
        }

        var instance = webcodebook.createCodebook('#container', {
          dataName: fileObj.dataName
        });
        instance.init(data);
      }
    );
  });
