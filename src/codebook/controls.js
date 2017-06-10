/*------------------------------------------------------------------------------------------------\
  Define controls object.
\------------------------------------------------------------------------------------------------*/

import { init } from "./controls/init";
import { filters } from "./controls/filters";
import { groups } from "./controls/groups";
import { chartToggle } from "./controls/chartToggle";
import { dataListingToggle } from "./controls/dataListingToggle";
import { controlToggle } from "./controls/controlToggle";

export const controls = {
  init: init,
  filters: filters,
  groups: groups,
  chartToggle: chartToggle,
  dataListingToggle: dataListingToggle,
  controlToggle: controlToggle
};
