/*------------------------------------------------------------------------------------------------\
  Define controls object.
\------------------------------------------------------------------------------------------------*/

import { init } from './controls/init';
import { filters } from './controls/filters';
import { groups } from './controls/groups';
import { controlToggle } from './controls/controlToggle';
import { highlight } from './controls/highlight';
import { updateRowCount } from './controls/updateRowCount';

export const controls = {
  init: init,
  filters: filters,
  groups: groups,
  controlToggle: controlToggle,
  highlight: highlight,
  updateRowCount: updateRowCount
};
