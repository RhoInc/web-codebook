/*------------------------------------------------------------------------------------------------\
  Define controls object.
\------------------------------------------------------------------------------------------------*/

import { init } from './controls/init';
import { filters } from './controls/filters';
import { groups } from './controls/groups';
import { chartToggle } from './controls/chartToggle';
import { controlToggle } from './controls/controlToggle';
import { clearHighlight } from './controls/clearHighlight';

export const controls = {
  init: init,
  filters: filters,
  groups: groups,
  chartToggle: chartToggle,
  controlToggle: controlToggle,
  clearHighlight: clearHighlight
};
