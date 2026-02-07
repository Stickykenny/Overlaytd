import * as d3 from "d3";
import { tooltipConfig } from "./tree.config";
export default class TreeTemplates {
  tooltipWrapper = d3
    .select("app-tree")
    //.append("foreignObject") // SVG doesn't allow div, but 'foreignObject' does
    .append("div")
    .attr("class", "tooltip-wrapper")
    .style("opacity", 0.9);

  tooltip = this.tooltipWrapper
    .append("div")
    .attr("class", "tooltip-content shadow p-3 mb-5 bg-white rounded")
    .style("position", "absolute")
    .style("background", "rgba(255, 255, 255, 0.9)")
    .style("backdrop-filter", "blur(5px)")
    .style("padding", "6px 10px")
    .style("border-radius", "4px")
    .style("opacity", 1)
    .style("font-family", "sans-serif")
    .style("font-size", tooltipConfig.font.size + "px")
    .style("backdrop-filter", "blur(3px)")
    .style("color", "#000000")
    .style("max-width", "40vw")
    .style("max-height", "30vh")
    .style("overflow-y", "auto"); // Enable vertical scroll

  tooltipCloseButton = this.tooltipWrapper
    .append("button")
    .attr("class", "tooltip-btn btn btn-danger btn-sm")
    .style("display", "none")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("left", `0px`)
    .style("top", "0px")
    .text("✖");
  //.on("click", () => this.clearTooltip());
}
