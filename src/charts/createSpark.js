import { select } from 'd3';
import makeHist from './spark/makeHist';

export default function createSpark() {
    const d = select(this).datum();
    if (d.statistics.n > 0)
        makeHist(this, d);
}
