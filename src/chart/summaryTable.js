/*------------------------------------------------------------------------------------------------\
  Define summaryTable object (the meat and potatoes).
\------------------------------------------------------------------------------------------------*/

import { init } from './summaryTable/init';
import { draw } from './summaryTable/draw';
import { destroy } from './summaryTable/destroy';


export const summaryTable =
    {init: init
    ,draw: draw
    ,destroy: destroy
   };
