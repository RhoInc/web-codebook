import availableTabs from './availableTabs'
import { select as d3select } from "d3";

export function init(codebook) {

  codebook.nav.wrap.selectAll("*").remove();
  console.log(codebook.config)
  //permanently hide the codebook sections that aren't included
  availableTabs
  .forEach(function(tab){
    tab.wrap = d3select(tab.selector)
    tab.wrap.classed("hidden", codebook.config.tabs.indexOf(tab.key)==-1)
  })

  //get the tabs for the current codebook
  codebook.nav.tabs = availableTabs.filter(tab => codebook.config.tabs.indexOf(tab.key)>-1);

  //set the active tabs
  codebook.nav.tabs.forEach(function(t){
    t.active = t.key == codebook.config.defaultTab
    t.wrap.classed("hidden",!t.active)
  })

  //draw the nav
  var chartNav = codebook.nav.wrap.append("ul").attr("class", "nav nav-tabs");
  var navItems = chartNav
    .selectAll("li")
    .data(codebook.nav.tabs) //make this a setting
    .enter()
    .append("li")
    .classed("active", function(d, i) {
      return d.active; //make this a setting
    });



  navItems.append("a").text(function(d) {
    return d.label;
  });

  //event listener for nav clicks
  navItems.on("click", function(d) {
    console.log("clicked on "+d.label)
    if (!d.active) {
      codebook.nav.tabs.forEach(function(t){
        t.active = d.label==t.label //set the clicked tab to active
        navItems.filter(f=>f==t).classed("active",t.active) //style the active nav element
        t.wrap.classed("hidden",!t.active) //hide all of the wraps (except for the active one)
      })
      console.log(codebook.nav.tabs)
    }
  });


/*
  const container = codebook.nav.wrap
    .append("button")
    .attr("class","data-listing-toggle")
    .text(
      codebook.dataListing.wrap.style("display") === "none"
        ? "View data"
        : "View codebook"
    );
  container.on("click", function() {
    if (codebook.dataListing.wrap.style("display") === "none") {
      codebook.dataListing.wrap.classed("hidden", false);
      codebook.summaryTable.wrap.classed("hidden", true);
      container.text("View codebook");
    } else {
      codebook.dataListing.wrap.classed("hidden", true);
      codebook.summaryTable.wrap.classed("hidden", false);
      container.text("View data");
    }
  });
  */
}
