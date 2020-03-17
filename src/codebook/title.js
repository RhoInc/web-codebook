/*------------------------------------------------------------------------------------------------\
  Define title object.
\------------------------------------------------------------------------------------------------*/

import { init } from './title/init';
import { highlight } from './title/highlight';
import { updateCountSummary } from './title/updateCountSummary';

export const title = {
    init: init,
    highlight: highlight,
    updateCountSummary: updateCountSummary
};
