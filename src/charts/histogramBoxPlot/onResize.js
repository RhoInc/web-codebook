import makeTooltip from "./makeTooltip";
import moveYaxis from "./moveYaxis";
import {
  format as d3format,
  quantile as d3quantile,
  mean as d3mean,
  deviation as d3deviation,
  mouse as d3mouse
} from "d3";

export default function onResize() {
  const context = this;
  const format = d3format(this.config.measureFormat);

  moveYaxis(this);

  //Hide overall plot if [settings.overall] is set to false.
  if (!this.config.overall && !this.group) this.wrap.style("display", "none");
  else {
    //Clear custom marks.
    this.svg.selectAll("g.svg-tooltip").remove();
    this.svg.selectAll(".statistic").remove();

    this.svg.selectAll("g.bar-group").each(function(d, i) {
      makeTooltip(d, i, context);
    });

    //Annotate quantiles
    if (this.config.boxPlot) {
      const quantiles = [
        { probability: 0.05, label: "5th percentile" },
        { probability: 0.25, label: "1st quartile" },
        { probability: 0.50, label: "Median" },
        { probability: 0.75, label: "3rd quartile" },
        { probability: 0.95, label: "95th percentile" }
      ];

      for (const item in quantiles) {
        const quantile = quantiles[item];
        quantile.quantile = d3quantile(this.values, quantile.probability);

		// Label lower & upper whiskers for future use in plotting outliers
		//-----------------------------------------------------------------
		if ( quantile.probability == 0.05 ){
			const lower_whisker =  quantile.quantile;
		}
		else if (quantile.probability == 0.95){
			const upper_whisker = quantile.quantile;
		}
		//-----------------------------------------------------------------
		
        //Horizontal lines
        if ([0.05, 0.75].indexOf(quantile.probability) > -1) {
          const rProbability = quantiles[+item + 1].probability;
          const rQuantile = d3quantile(this.values, rProbability);
          const whisker = this.svg
            .append("line")
            .attr({
              class: "statistic",
              x1: this.x(quantile.quantile),
              y1: this.plot_height + this.config.boxPlotHeight / 2,
              x2: this.x(rQuantile),
              y2: this.plot_height + this.config.boxPlotHeight / 2
            })
            .style({
              stroke: "black",
              "stroke-width": "2px",
              opacity: 0.25
            });
          whisker
            .append("title")
            .text(
              `Q${quantile.probability}-Q${rProbability}: ${format(quantile.quantile)}-${format(rQuantile)}`
            );
        }

        //Box
        if (quantile.probability === 0.25) {
          const q3 = d3quantile(this.values, 0.75);
          const interQ = this.svg
            .append("rect")
            .attr({
              class: "statistic",
              x: this.x(quantile.quantile),
              y: this.plot_height,
              width: this.x(q3) - this.x(quantile.quantile),
              height: this.config.boxPlotHeight
            })
            .style({
              fill: "#ffffff",
              opacity: 0.25
            });
          interQ
            .append("title")
            .text(
              `Interquartile range: ${format(quantile.quantile)}-${format(q3)}`
            );
        }

        //Vertical lines
        quantile.mark = this.svg
          .append("line")
          .attr({
            class: "statistic",
            x1: this.x(quantile.quantile),
            y1: this.plot_height,
            x2: this.x(quantile.quantile),
            y2: this.plot_height + this.config.boxPlotHeight
          })
          .style({
            stroke: [0.05, 0.95].indexOf(quantile.probability) > -1
              ? "black"
              : [0.25, 0.75].indexOf(quantile.probability) > -1
                  ? "black"
                  : "black",
            "stroke-width": "3px"
          });
        quantile.mark
          .append("title")
          .text(`${quantile.label}: ${format(quantile.quantile)}`);
      }
    }

    //Annotate mean.
    if (this.config.mean) {
      const mean = d3mean(this.values);
      const sd = d3deviation(this.values);
      const meanMark = this.svg
        .append("circle")
        .attr({
          class: "statistic",
          cx: this.x(mean),
          cy: this.plot_height + this.config.boxPlotHeight / 2,
          r: this.config.boxPlotHeight / 3
        })
        .style({
          fill: "#000000",
          stroke: "black",
          "stroke-width": "1px"
        });
      meanMark
        .append("title")
        .text(
          `n: ${this.values.length}\nMean: ${format(mean)}\nSD: ${format(sd)}`
        );
    }

	//Mark Outliers
	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	//Loop through all data points
	for( point in this.values ){
		// if the data point is below the lower whisker (0.5) or above the upper whisker (0.95)
		if(( point < lower_whisker ) || ( point > upper_whisker ){
			// plot as circle
			.append("circle")
			.attr({
				class: "statistic",
				// plot at x location (this.values)
				cx: point,
				// plot at y location (same y coordinate as mean circle)
				cy: this.plot_height + this.config.boxPlotHeight / 2,
				// plot with radius (same radius as mean circle)
				r: this.config.boxPlotHeight / 3
			})
			.style({
				// Inherit same style as mean circle
				fill: "#000000",
				stroke: "black",
				"stroke-width": "1px"
			});
		}
	}
	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //Rotate y-axis labels.

    this.svg.select("g.y.axis text.axis-title").remove();
    /*
    this.svg
      .select("g.y.axis")
      .insert("text", ":first-child")
      .attr({
        class: "axis-title",
        x: this.plot_width,
        y: this.plot_height / 2,
        dx: "1em"
      })
      .style("text-anchor", "start")
      .text(
        this.group
          ? "Level: " +
              this.config.y.label +
              " \n(n=" +
              this.values.length +
              ")"
          : ""
      );
*/
    //Hide legends.
    this.wrap.select("ul.legend").remove();

    //Shift x-axis tick labels downward.
    var yticks = this.svg.select(".x.axis").selectAll("g.tick");
    yticks.select("text").remove();
    yticks
      .append("text")
      .attr("y", context.config.boxPlotHeight)
      .attr("dy", "1em")
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "top")
      .text(d => d);

    //Add modal to nearest mark.
    const bars = this.svg.selectAll(".bar-group");
    const tooltips = this.svg.selectAll(".svg-tooltip");
    const statistics = this.svg.selectAll(".statistic");
    this.svg
      .on("mousemove", function() {
        //Highlight closest bar.
        const mouse = d3mouse(this);
        const x = context.x.invert(mouse[0]);
        const y = context.y.invert(mouse[1]);
        let minimum;
        let bar = {};
        bars.each(function(d, i) {
          d.distance = Math.abs(d.midpoint - x);
          if (i === 0 || d.distance < minimum) {
            minimum = d.distance;
            bar = d;
          }
        });
        const closest = bars
          .filter(d => d.distance === minimum)
          .filter((d, i) => i === 0)
          .select("rect")
          .style("fill", "#000000");

        //Activate tooltip.
        const d = closest.datum();
        tooltips.classed("active", false);
        context.svg.select("#" + d.selector).classed("active", true);
      })
      .on("mouseout", function() {
        bars.select("rect").style("fill", "#999");
        context.svg.selectAll("g.svg-tooltip").classed("active", false);
      });
  }
}
