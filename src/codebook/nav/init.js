import availableTabs from './availableTabs';
import { select as d3select } from 'd3';
import clone from '../../util/clone';

export function init(codebook) {
    const defaultTabs = clone(availableTabs);
    codebook.nav.wrap.selectAll('*').remove();

    //permanently hide the codebook sections that aren't included
    defaultTabs.forEach(function(tab) {
        tab.wrap = codebook.wrap.select(tab.selector);
        tab.wrap.classed(
            'hidden',
            codebook.config.tabs.map(m => m.key).indexOf(tab.key) == -1
        );
    });

    //get the tabs for the current codebook
    codebook.nav.tabs = defaultTabs.filter(
        tab => codebook.config.tabs.map(m => m.key).indexOf(tab.key) > -1
    );

    //overwrite labels/instruction if specified by user
    codebook.nav.tabs.forEach(function(tab) {
        var settingsMatch = codebook.config.tabs.filter(
            f => f.key == tab.key
        )[0];
        tab.label = settingsMatch.label || tab.label;
        tab.controls = settingsMatch.controls || tab.controls;
        tab.instructions = settingsMatch.instructions || tab.instructions;
    });

    //set the active tabs
    codebook.nav.tabs.forEach(function(t) {
        t.active = t.key == codebook.config.defaultTab;
        t.wrap.classed('hidden', !t.active);
    });

    //draw the nav
    if (codebook.nav.tabs.length > 1) {
        var chartNav = codebook.nav.wrap
            .append('ul')
            .attr('class', 'wcb-nav wcb-nav-tabs');
        var navItems = chartNav
            .selectAll('li')
            .data(codebook.nav.tabs) //make this a setting
            .enter()
            .append('li')
            .attr('class', d => d.key)
            .classed('active', function(d, i) {
                return d.active; //make this a setting
            })
            .attr('title', d => `View ${d.key}`);

        navItems.append('a').html(function(d) {
            return d.label;
        });

        //event listener for nav clicks
        navItems.on('click', function(d) {
            if (!d.active) {
                codebook.nav.tabs.forEach(function(t) {
                    t.active = d.label == t.label; //set the clicked tab to active
                    navItems.filter(f => f == t).classed('active', t.active); //style the active nav element
                    t.wrap.classed('hidden', !t.active); //hide all of the wraps (except for the active one)
                });

                codebook.instructions.update(codebook);

                //show/hide the controls (unless they are disabled)
                if (codebook.config.controlVisibility !== 'hidden')
                    codebook.config.previousControlVisibility =
                        codebook.config.controlVisibility;
                if (codebook.config.controlVisibility != 'disabled') {
                    codebook.config.controlVisibility = d.controls
                        ? codebook.config.previousControlVisibility
                        : 'hidden';
                    codebook.controls.controlToggle.set(codebook);
                }
            }
        });
    }
}
