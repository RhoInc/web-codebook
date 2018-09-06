import defaultSettings from './defaultSettings';

export function setDefaults() {
  var explorer = this;
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

  //drop ignoredColumns and system variables
  explorer.config.tableConfig.cols = Object.keys(explorer.config.files[0])
    .filter(f => explorer.config.ignoredColumns.indexOf(f) == -1)
    .filter(
      f => ['fileID', 'settings', 'selected', 'event', 'json'].indexOf(f) == -1
    ); //drop system variables from table

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
