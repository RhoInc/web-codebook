import defaultSettings from './defaultSettings';

export function setDefaults(explorer) {
  /********************* ignoredColumns *********************/
  var firstKey = Object.keys(explorer.config.files[0])[0];
  explorer.config.ignoredColumns = explorer.config.ignoredColumns || firstKey;

  /********************* labelColumn *********************/
  explorer.config.labelColumn =
    explorer.config.labelColumn || defaultSettings.labelColumn;

  /********************* files[].settings ***************/
  explorer.config.files.forEach(function(f) {
    f.settings = f.settings || {};
  });
}
