export default function addViolin(svg, results, height, width, domain, imposeMax, violinColor){
  var interpolation = "basis"

    var data = d3.layout.histogram()
        .bins(10)
        .frequency(0)
        (results);

    var y = d3.scale.linear()
      .range([width/2, 0 ])
      .domain([0, Math.max(imposeMax, d3.max(data, function(d) {return d.y; }))])
      .clamp(true);

    var x = d3.scale.linear()
        .range([height, 0 ])
        .domain(domain)
        //.nice() ;


    var area = d3.svg.area()
        .interpolate(interpolation)
        .x(function(d) {
               if(interpolation=="step-before")
                    return x(d.x+d.dx/2)
               return x(d.x);
            })
        .y0(width/2)
        .y1(function(d) { return y(d.y); });

    var line=d3.svg.line()
        .interpolate(interpolation)
        .x(function(d) {
               if(interpolation=="step-before")
                    return x(d.x+d.dx/2)
               return x(d.x);
            })
        .y(function(d) { return y(d.y); });

    var gPlus=svg.append("g")
    var gMinus=svg.append("g")

    gPlus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", violinColor);

    gPlus.append("path")
      .datum(data)
      .attr("class", "violin")
      .attr("d", line)
      .attr("stroke", violinColor)
      .attr("fill", "none");


    gMinus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", violinColor);

    gMinus.append("path")
      .datum(data)
      .attr("class", "violin")
      .attr("d", line)
      .attr("stroke", violinColor)
      .attr("fill", "none");

    gPlus.attr("transform", "rotate(90,0,0)  translate(0,-"+width+")");//translate(0,-200)");
    gMinus.attr("transform", "rotate(90,0,0) scale(1,-1)");

};
