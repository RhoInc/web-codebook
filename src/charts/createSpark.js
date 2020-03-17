import { select } from 'd3';
import makeHist from './spark/makeHist';

export default function createSpark() {
    var d = select(this).datum();
    if (d.statistics.n > 0) {
        makeHist(this, d);
    }
}
