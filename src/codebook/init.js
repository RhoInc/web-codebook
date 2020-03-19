/*------------------------------------------------------------------------------------------------\
  Initialize codebook
\------------------------------------------------------------------------------------------------*/

//import clone from '../util/clone';
import indicateLoading from './util/indicateLoading';

export function init(data) {
    this.layout();

    indicateLoading(this, 'Codebook initialization', () => {
        // Call init event.
        this.events.init.call(this);

        // Attach data to codebook object.
        //this.data.raw = clone(data); // not sure why we're cloning the data, but this definitely adds overhead
        this.data.raw = data;
        this.data.variables = Object.keys(data[0]);
        this.data.nVariables = this.data.variables.length;
        this.data.raw.forEach((d, i) => {
            d['web-codebook-index'] = i + 1; // uniquely identifies each record
        });
        this.data.filtered = this.data.raw; // assume no filters active on init :/
        this.data.highlighted = [];

        // settings and defaults
        this.util.setDefaults(this);

        // data manipulation
        this.data.makeSummary(this);

        // title
        this.title.init(this);

        // Intialize controls.
        this.util.makeAutomaticFilters(this);
        this.util.makeAutomaticGroups(this);
        this.controls.init(this);

        // Intialize nav, title, and instructions.
        this.nav.init(this);
        this.instructions.init(this);

        // Call complete event.
        this.events.complete.call(this);

        // Initialize each module.
        this.summaryTable.draw(this);
        this.dataListing.init(this);
        this.chartMaker.init(this);
        this.settings.init(this);
    });
}
