/*------------------------------------------------------------------------------------------------\
  Define util object.
\------------------------------------------------------------------------------------------------*/

import { setDefaults } from './util/setDefaults';
import { makeAutomaticFilters } from './util/makeAutomaticFilters';
import { makeAutomaticGroups } from './util/makeAutomaticGroups';
import { getBinCounts } from './util/getBinCounts';

export const util = {
  setDefaults: setDefaults,
  makeAutomaticFilters: makeAutomaticFilters,
  makeAutomaticGroups: makeAutomaticGroups,
  getBinCounts: getBinCounts
};
