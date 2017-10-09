import availableTabs from './availableTabs';
import { select as d3select } from 'd3';

export function init(codebook) {
  codebook.nav.wrap.selectAll('*').remove();

  //permanently hide the codebook sections that aren't included
  availableTabs.forEach(function(tab) {
    tab.wrap = d3select(tab.selector);
    tab.wrap.classed('hidden', codebook.config.tabs.indexOf(tab.key) == -1);
  });

  //get the tabs for the current codebook
  codebook.nav.tabs = availableTabs.filter(
    tab => codebook.config.tabs.indexOf(tab.key) > -1
  );

  //set the active tabs
  codebook.nav.tabs.forEach(function(t) {
    t.active = t.key == codebook.config.defaultTab;
    t.wrap.classed('hidden', !t.active);
  });

  //set control visibility
  var activeTab = codebook.nav.tabs.filter(f => f.active)[0];
  if (codebook.config.controlVisibility != 'disabled') {
    codebook.config.controlVisibility = activeTab.controls
      ? 'visible'
      : 'hidden';
    codebook.controls.controlToggle.set(codebook);
  }

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
        if (codebook.config.controlVisibility != 'disabled') {
          codebook.config.controlVisibility = d.controls ? 'visible' : 'hidden';
          codebook.controls.controlToggle.set(codebook);
        }
      }
    });
  }
}
