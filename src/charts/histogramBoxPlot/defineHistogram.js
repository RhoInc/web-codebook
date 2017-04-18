import "../../util/object-assign";
import clone from "../../util/clone";
import defaultSettings, { syncSettings } from "./defaultSettings";

import { createChart } from "webcharts";

import onInit from "./onInit";
import onResize from "./onResize";

export function defineHistogram(element, settings) {
  //Merge specified settings with default settings.
  const mergedSettings = Object.assign({}, defaultSettings, settings);

  //Sync properties within merged settings.
  const syncedSettings = syncSettings(mergedSettings);

  //Sync control inputs with merged settings.
  //let syncedControlInputs = syncControlInputs(controlInputs, mergedSettings);
  //let controls = createControls(element, {location: 'top', inputs: syncedControlInputs});

  //Define chart.
  const chart = createChart(element, syncedSettings); // Add third argument to define controls as needed.
  chart.initialSettings = clone(syncedSettings);
  chart.initialSettings.container = element;
  chart.on("init", onInit);
  chart.on("resize", onResize);

  return chart;
}
