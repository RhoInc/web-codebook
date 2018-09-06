import defaultSettings from './defaultSettings';

export function setDefaults(explorer) {
  /********************* meta *********************/
  explorer.config.meta = explorer.config.meta || defaultSettings.meta;

  /********************* ignoredColumns *********************/
  explorer.config.ignoredColumns =
    explorer.config.ignoredColumns || defaultSettings.ignoredColumns;

  /********************* labelColumn *********************/
  var firstKey = Object.keys(explorer.config.files[0])[0];
  explorer.config.labelColumn = explorer.config.labelColumn || firstKey;

  /********************* tableConfig ***************/
  explorer.config.tableConfig =
    explorer.config.tableConfig || defaultSettings.tableConfig;

  /********************* defaultCodebookSettings ***************/
  explorer.config.defaultCodebookSettings =
    explorer.config.defaultCodebookSettings ||
    defaultSettings.defaultCodebookSettings;

  /********************* files[].settings ***************/
  explorer.config.files.forEach(function(f, i) {
    f.settings = f.settings || explorer.config.defaultCodebookSettings;
    f.fileID = i;
  });
}
