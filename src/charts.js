/*------------------------------------------------------------------------------------------------\
  Define controls object.
\------------------------------------------------------------------------------------------------*/

import { createVerticalBars } from './charts/createVerticalBars';
import { createVerticalBarsControls } from './charts/createVerticalBarsControls';
import { createHorizontalBars } from './charts/createHorizontalBars';
import { createHorizontalBarsControls } from './charts/createHorizontalBarsControls';
import { createHistogramBoxPlot } from './charts/createHistogramBoxPlot';
import { createHistogramBoxPlotControls } from './charts/createHistogramBoxPlotControls';
import { createDotPlot } from './charts/createDotPlot';

export const charts = {
    createVerticalBars: createVerticalBars,
    createVerticalBarsControls: createVerticalBarsControls,
    createHorizontalBars: createHorizontalBars,
    createHorizontalBarsControls: createHorizontalBarsControls,
    createHistogramBoxPlot: createHistogramBoxPlot,
    createHistogramBoxPlotControls: createHistogramBoxPlotControls,
    createDotPlot: createDotPlot
};
