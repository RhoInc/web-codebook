/*------------------------------------------------------------------------------------------------\
  Define controls object.
\------------------------------------------------------------------------------------------------*/

import { init } from './controls/init';
import { filters } from './controls/filters';
import { groups } from './controls/groups';
import { controlToggle } from './controls/controlToggle';

export const controls = {
  init: init,
  filters: filters,
  groups: groups,
  controlToggle: controlToggle
};
