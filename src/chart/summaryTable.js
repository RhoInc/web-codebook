/*------------------------------------------------------------------------------------------------\
  Define summaryTable object (the meat and potatoes).
\------------------------------------------------------------------------------------------------*/

import { init } from './summaryTable/init';
import { draw } from './summaryTable/draw';
import { destroy } from './summaryTable/destroy';
import { renderRow } from './summaryTable/renderRow';
import { updateSummaryText } from './summaryTable/updateSummaryText';


export const summaryTable =
    {init: init
    ,draw: draw
    ,destroy: destroy
    ,renderRow:renderRow
    ,updateSummaryText:updateSummaryText
   };
