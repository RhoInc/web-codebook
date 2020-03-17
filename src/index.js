import './polyfills/index';
import { createCodebook } from './createCodebook';
import { createExplorer } from './createExplorer';
import { charts } from './charts';

export default {
    createCodebook: createCodebook,
    createChart: createCodebook,
    createExplorer: createExplorer,
    charts: charts
};
