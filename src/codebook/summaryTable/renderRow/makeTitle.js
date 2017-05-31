import {
  select as d3select,
  format as d3format,
  set as d3set,
  merge as d3merge
} from "d3";

export default function makeTitle(d) {
  var wrap = d3select(this);
  var titleDiv = wrap.append("div").attr("class", "var-name");
  var valuesList = wrap.append("ul").attr("class", "value-list");

  //Title and type
  titleDiv.append("div").attr("class", "name").html(d => d.value_col);
  titleDiv.append("div").attr("class", "type").html(d => d.type);

  //make a list of values
  if (d.type == "categorical") {
    //valuesList.append("span").text( "Values (Most Frequent):")
    var topValues = d.statistics.values
      .sort(function(a, b) {
        return b.n - a.n;
      })
      .filter(function(d, i) {
        return i < 5;
      });

    valuesList
      .selectAll("li")
      .data(topValues)
      .enter()
      .append("li")
      .text(d => d.key + " (" + d3format("0.1%")(d.prop_n) + ")")
      .attr("title", d => "n=" + d.n)
      .style("cursor", "help");

    if (d.statistics.values.length > 5) {
      var totLength = d.statistics.values.length;
      var extraCount = totLength - 5;
      var extra_span = valuesList
        .append("span")
        .html("and " + extraCount + " more.");
    }
  } else if (d.type == "continuous") {
    //valuesList.append("span").text( "Values (Most Frequent):"
    var sortedValues = d3set(d.values)
      .values() //get unique
      .map(d => +d) //convert to numeric
      .sort(function(a, b) {
        return a - b;
      }); // sort low to high

    var minValues = sortedValues.filter(function(d, i) {
      return i < 3;
    });
    var nValues = sortedValues.length;
    var maxValues = sortedValues.filter(function(d, i) {
      return i >= nValues - 3;
    });
    var valList = d3merge([minValues, ["..."], maxValues]);

    valuesList
      .selectAll("li")
      .data(valList)
      .enter()
      .append("li")
      .text(d => d)
      .attr("title", d => (d == "..." ? nValues - 6 + " other values" : ""))
      .style("cursor", d => (d == "..." ? "help" : null));
  }
}
