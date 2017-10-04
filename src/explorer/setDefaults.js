import defaultSettings from './defaultSettings';

export function setDefaults(explorer) {
  /********************* meta *********************/
  explorer.config.meta = explorer.config.meta || defaultSettings.meta;

  /********************* ignoredColumns *********************/
  var firstKey = Object.keys(explorer.config.files[0])[0];
  explorer.config.ignoredColumns =
    explorer.config.ignoredColumns || defaultSettings.ignoredColumns;

  /********************* labelColumn *********************/
  explorer.config.labelColumn = explorer.config.labelColumn || firstKey;

  /********************* tableConfig ***************/
  explorer.config.tableConfig =
    explorer.config.tableConfig || defaultSettings.tableConfig;

  /********************* files[].settings ***************/
  explorer.config.files.forEach(function(f) {
    f.settings = f.settings || {};
  });
}
