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
        //console.log('Data file metadata:');
        //console.log(json);
        //const fileObj = json[Math.floor(Math.random() * json.length)];
        const fileObj = json[8];
        //console.log('Select data file metadata:');
        //console.log(fileObj);
        d3.csv(
            fileObj.github_url,
            function(d) {
                return d;
            },
            function(error, data) {
                if (error) {
                    console.log(error);
                    alert(
                        `${
                            fileObj.github_url
                        } does not exist. Please reload page.`
                    );
                }

                const variableTypes = [
                    {
                        "value_col": "USUBJID",
                        "type": "categorical"
                    },
                    {
                        "value_col": "SITE",
                        "type": "categorical"
                    },
                    {
                        "value_col": "SITEID",
                        "type": "categorical"
                    },
                    {
                        "value_col": "AGE",
                        "type": "continuous"
                    },
                    {
                        "value_col": "SEX",
                        "type": "categorical"
                    },
                    {
                        "value_col": "RACE",
                        "type": "categorical"
                    },
                    {
                        "value_col": "ARM",
                        "type": "categorical"
                    },
                    {
                        "value_col": "ARMCD",
                        "type": "categorical"
                    },
                    {
                        "value_col": "SBJTSTAT",
                        "type": "categorical"
                    },
                    {
                        "value_col": "RFSTDTC",
                        "type": "categorical"
                    },
                    {
                        "value_col": "RFENDTC",
                        "type": "categorical"
                    },
                    {
                        "value_col": "RFENDY",
                        "type": "continuous"
                    },
                    {
                        "value_col": "SAFFL",
                        "type": "categorical"
                    },
                    {
                        "value_col": "SAFFN",
                        "type": "categorical"
                    },
                    {
                        "value_col": "RANDDT",
                        "type": "categorical"
                    },
                    {
                        "value_col": "RANDDY",
                        "type": "continuous"
                    },
                    {
                        "value_col": "COMPLDT",
                        "type": "categorical"
                    },
                    {
                        "value_col": "COMPLDY",
                        "type": "continuous"
                    },
                    {
                        "value_col": "ANYAEFL",
                        "type": "categorical"
                    },
                    {
                        "value_col": "ANYCMFL",
                        "type": "categorical"
                    }
                ];
                const settings = {
                    dataName: fileObj.dataName
                };
                const specifyVariableTypes = true;
                if (specifyVariableTypes)
                    settings.variableTypes = variableTypes;

                var instance = webcodebook.createCodebook(
                    '#container',
                    settings
                );
                instance.init(d3.merge(Array(1000).fill(data)));
            }
        );
    });
