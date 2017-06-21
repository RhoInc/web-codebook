import moveYaxis from "./moveYaxis";
import drawOverallMark from "./drawOverallMark";
import drawDifferences from "./drawDifferences";

export default function onResize() {
  moveYaxis(this);
  if (this.config.x.column === "prop_n") {
    drawOverallMark(this);

    if (this.config.group_col) drawDifferences(this);
  }
}
