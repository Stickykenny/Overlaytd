import { Astre } from "src/app/models/Astre";
import * as d3 from "d3";

export default class TreeUtils {
  static getParentLink(pointNode: d3.HierarchyPointNode<Astre>): d3.HierarchyPointLink<Astre> | null {
    var parentNode: d3.HierarchyPointNode<Astre> | null = pointNode.parent;
    if (!parentNode) {
      return null;
    }
    return parentNode.links().find((link) => link.target == pointNode) ?? null;
  }

  static getSiblingNodes(pointNode: d3.HierarchyPointNode<Astre>): d3.HierarchyPointNode<Astre>[] {
    var parentNode: d3.HierarchyPointNode<Astre> | null = pointNode.parent;
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
    var siblingArrays: d3.HierarchyPointNode<Astre>[] = this.getSiblingNodes(pointNode);
    for (var i = 0; i < siblingArrays.length; i++) {
      if (siblingArrays.at(i) == pointNode) {
        return [i, siblingArrays.length];
      }
    }
    return [0, 1];
  }
}
