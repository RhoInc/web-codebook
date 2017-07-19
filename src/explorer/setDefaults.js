import defaultSettings from './defaultSettings';

export function setDefaults(explorer) {
  /********************* labelColumn *********************/
  explorer.config.labelColumn =
    explorer.config.labelColumn || defaultSettings.labelColumn;

  /********************* files[].settings ***************/
  explorer.config.files.forEach(function(f) {
    f.settings = f.settings || {};
  });
}
