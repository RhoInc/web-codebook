/*------------------------------------------------------------------------------------------------\
  Define summaryTable object (the meat and potatoes).
\------------------------------------------------------------------------------------------------*/

import { init } from './summaryTable/init';
import { draw } from './summaryTable/draw';
import { destroy } from './summaryTable/destroy';
import { renderRow } from './summaryTable/renderRow';


export const summaryTable =
    {init: init
    ,draw: draw
    ,destroy: destroy
    ,renderRow:renderRow
   };
