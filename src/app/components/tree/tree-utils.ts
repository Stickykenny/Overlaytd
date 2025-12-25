import { Astre } from "src/app/models/Astre";
import * as d3 from "d3";

export default class TreeUtils {
  static getParentLink(pointNode: d3.HierarchyPointNode<Astre>): d3.HierarchyPointLink<Astre> | null {
    let parentNode: d3.HierarchyPointNode<Astre> | null = pointNode.parent;
    if (!parentNode) {
      return null;
    }
    return parentNode.links().find((link) => link.target == pointNode) ?? null;
  }

  static getSiblingNodes(pointNode: d3.HierarchyPointNode<Astre>): d3.HierarchyPointNode<Astre>[] {
    let parentNode: d3.HierarchyPointNode<Astre> | null = pointNode.parent;
    if (!parentNode) {
      return [];
    }
    return parentNode.descendants();
  }

  /**
   * Return the index of the pointNode and the total number of siblings
   * across all siblings from the same parent
   *
   * @param pointNode
   * @returns The index of the sibling and the total number of siblings
   */
  static getIndexInSiblings(pointNode: d3.HierarchyPointNode<Astre>): [number, number] {
    let siblingArrays: d3.HierarchyPointNode<Astre>[] = this.getSiblingNodes(pointNode);
    for (let i = 0; i < siblingArrays.length; i++) {
      if (siblingArrays.at(i) == pointNode) {
        return [i, siblingArrays.length];
      }
    }
    return [0, 1];
  }
}

export function computeBranchColor(link: d3.HierarchyPointLink<Astre>): string {
  let hue = 0; // Default
  const hueDeviationRange = 25;
  let targetPoint = link.target;

  if (link.target.depth <= 1) {
    return d3.hsl(hue, 1, 0.9, 1).darker(targetPoint.depth).clamp().formatHex();
  }

  let [siblingIdx, totalSiblings] = TreeUtils.getIndexInSiblings(targetPoint);
  let hueSteps: number = hueDeviationRange / totalSiblings;

  let parentLink = TreeUtils.getParentLink(link.source);
  let parentLinkColor = d3
    .selectAll<SVGPathElement, d3.HierarchyPointLink<Astre>>(".link")
    .filter((link) => link.target == parentLink?.target)
    .attr("stroke");
  console.log(d3.hsl(parentLinkColor).clamp().formatHex());
  return ""; // d3.hsl(parentLinkColor, 1, 0.9, 1).darker(targetPoint.depth).clamp().formatHsl();
}
