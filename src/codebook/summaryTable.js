/*------------------------------------------------------------------------------------------------\
  Define summaryTable object (the meat and potatoes).
\------------------------------------------------------------------------------------------------*/
import { draw } from './summaryTable/draw';
import { renderRow } from './summaryTable/renderRow';
import { updateSummaryText } from './summaryTable/updateSummaryText';

export const summaryTable = {
  draw: draw,
  renderRow: renderRow,
  updateSummaryText: updateSummaryText
};
