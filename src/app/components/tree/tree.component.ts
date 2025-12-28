import { Component, AfterViewInit, ElementRef, ViewChild, SimpleChanges, inject } from "@angular/core";
import * as d3 from "d3";
import { ToastrService } from "ngx-toastr";
import { Astre } from "src/app/models/Astre";

import { Tags } from "src/app/models/Tags";

import { linkConfig, rainbowLoop, tooltipConfig } from "./tree.config";
import { offlineDb } from "src/app/db/offlineDb";
import { ApiService } from "src/app/api.service";
import { PageInfoService } from "src/app/page-info.service";
import { PAGE_DESCRIPTIONS } from "src/app/shared/page-descriptions";
import { computeBranchColor } from "./tree-utils";
@Component({
  selector: "app-tree",
  template: `
    <div class="tree-wrapper">
      <svg #svgContainer style="width:90vw; height:88vh;"></svg>
    </div>
  `,
})
export class TreeComponent implements AfterViewInit {
  @ViewChild("svgContainer", { static: true })
  svgRef!: ElementRef<SVGSVGElement>;

  public astres: Astre[];
  astreService: ApiService = inject(ApiService); // Angular 14+, can only be run before or in constructor phase

  childColumn = "";
  parentColumn = "";

  // Tooltip variables
  svgBounds: any;
  tooltipPinned: boolean = false;
  tooltipWrapper: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  tooltipCloseButton: d3.Selection<HTMLButtonElement, unknown, HTMLElement, any>;
  tooltipAnchor: d3.HierarchyPointNode<Astre>;

  constructor(private toastr: ToastrService, private pageInfoService: PageInfoService) {}

  ngOnInit() {
    this.pageInfoService.updateInformation(PAGE_DESCRIPTIONS.tree);
  }
  ngAfterViewInit(): void {
    const svgElement = this.svgRef.nativeElement as SVGSVGElement;
    // get actual pixel dimensions from browser layout
    this.svgBounds = svgElement.getBoundingClientRect();
    offlineDb.getItems().then((astres) => {
      this.astres = astres;
      this.astres = this.astres.filter((a) => a.astreID.type == "topic");
      this.loadTree();
    });
  }
  ngOnChanges(changes: SimpleChanges) {}

  /**
   * Hide the tooltip
   * Also set pin flag to false
   */
  clearTooltip() {
    this.tooltipPinned = false;
    this.tooltipWrapper.style("display", "none");
    this.tooltipCloseButton.style("display", "none");
    this.tooltipWrapper.transition().duration(200).style("opacity", 0);
  }
  /**
   * Render a tooltip given the data provided by pointNode
   *
   * @param tooltip The tooltip that will be rendered
   * @param pointNode The node with the data to display
   * @param event The event produced
   * @param anchor The node used as a reference for coordinates
   *
   */
  renderTooltip(
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, undefined>,
    pointNode: d3.HierarchyPointNode<Astre>,
    event: MouseEvent,
    anchor: d3.HierarchyPointNode<Astre>
  ) {
    tooltip.style("display", "block");
    tooltip.style("pointer-events", "auto");
    let astre: Astre = pointNode.data as Astre;
    let astreTags = astre.tags;
    let additionalComments = "";

    const [x, y] = d3.pointRadial(anchor.x, anchor.y); // Relative coordinate to RootNode

    const node = tooltip.node() as HTMLElement; // cast
    let isLeft = x < 0;
    let isUp = y < 0;

    if (astre.tags == null || astre.tags.length == 0) {
      astreTags = "<span style='color:LightGrey;'>No Tags Found</span>";
    } else {
      // === Custom Tooltip comments based on tags ===
      let tagsList = astreTags.split(",");
      for (let tagName of tagsList) {
        switch (tagName.toLowerCase()) {
          case Tags.HighlightedList.toLowerCase(): {
            additionalComments +=
              "</br><span style='font-style:italic;'>This Node only has the most impactful entries (non-exhaustive)</span>";
            break;
          }
          case Tags.ExternalList.toLowerCase(): {
            additionalComments +=
              "</br><span style='font-style:italic;'>This Node possess an external list that isn't hosted on this site (Please refer to the description)</span>";
            break;
          }
          default: {
            break;
          }
        }
      }
    }

    // ==================
    const tooltipNode = tooltip
      .style("line-height", "0.9")
      .html(
        `<b>${astre.astreID.name}</b></br>
            <span style='font-size:${tooltipConfig.comment.font.size}px'>[${astreTags}] in ${astre.parent} </span> </br>
            ${astre.description} </br>
            <span style='font-size:${tooltipConfig.comment.font.size}px'>${additionalComments} </span>`
      )
      .node();
    if (!node) return; // nothing to do if tooltip not rendered
    const tooltipBox = tooltipNode!.getBoundingClientRect();
    let widthOffset = tooltipBox.width + 20;
    let heightOffset = tooltipBox.height;
    tooltip
      .style("left", isLeft ? event.pageX - widthOffset + `px` : event.pageX + `px`)
      .style("top", isUp ? event.pageY - heightOffset + "px" : event.pageY + "px")
      .style("text-align", isLeft ? "end" : "start");
    if (event instanceof PointerEvent) {
      // Clicked instance
      // !! Creating additional DOM on each 'hover' event causes performance issue, so the close button DOM element only appear on clicked

      this.tooltipWrapper.style("pointer-events", "auto");
      let tooltipCloseButtonNode = this.tooltipCloseButton.node();
      if (!tooltipCloseButtonNode) return; // nothing to do if tooltip not rendered
      let margin = 35;
      this.tooltipCloseButton
        .style("opacity", 1)
        .style(
          "left",
          isLeft
            ? event.pageX - tooltipCloseButtonNode.getBoundingClientRect().width - margin + `px`
            : event.pageX + 5 + `px`
        )
        .style("top", isUp ? event.pageY - heightOffset - margin + "px" : event.pageY - margin + "px");
    }
  }

  /**
   * Pre-process the data before initializing the tree
   */
  loadTree() {
    if (this.astres.length === 0) {
      this.astreService.getLocalAstres().subscribe((astres: Astre[]) => {
        this.astres = astres;
        this.toastr.info("Using example data as replacement", "No data found");
        this.initTree(this.astres);
      });
    } else {
      this.initTree(this.astres);
    }
  }

  separation(a: Astre, b: Astre) {
    return a.parent == b.parent ? 1 : 2;
  }

  /**
   * Init a radial tree given the data
   *
   * @param astres List of astre that are correctly pre-processed
   */
  initTree(astres: Astre[]): void {
    let rootCheck = this.astres.filter((astre) => astre.parent == "");
    if (rootCheck.length > 1) {
      this.toastr.error(
        "Please only keep one root for the tree : " +
          Array.from(rootCheck.map((astre) => astre.astreID.type + "-" + astre.astreID.name)).join(" | "),
        "Multiple Roots found",
        { disableTimeOut: true }
      );
    }

    this.childColumn = "astreid.name";
    this.parentColumn = "parent";
    const ids = new Set(this.astres.map((d) => d.astreID.name));

    let [validAstres, invalidAstres] = this.astres.reduce(
      (acc, astre: Astre) => {
        if (!astre.parent || ids.has(astre.parent)) {
          acc[0].push(astre); // valid
        } else {
          acc[1].push(astre); // invalid
        }
        return acc;
      },
      [[], []] as [Astre[], Astre[]]
    );

    if (invalidAstres.length > 0) {
      console.log("invalids : ");
      console.log(invalidAstres);
      this.toastr.info(
        "Invalid (Parent not found) : (" +
          invalidAstres.length +
          ") " +
          Array.from(invalidAstres.map((astre) => astre.astreID.type + "-" + astre.astreID.name)).join(" | "),
        "Invalid Nodes",
        { disableTimeOut: true }
      );
    }
    astres = validAstres;

    // === Create Tree ===
    let root: d3.HierarchyNode<Astre>;

    root = d3
      .stratify<Astre>()
      .id((d: Astre) => d.astreID.name)
      .parentId((d: Astre) => d.parent)(astres);

    let radius = 10 * astres.length + Math.log(50 * astres.length) + 500;
    radius = radius < 200 ? 200 : radius;

    const tree = d3
      .tree<Astre>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.5) / Math.min(a.depth, b.depth + 1));
    const rootPoint = tree(root as d3.HierarchyNode<Astre>);

    // === Select SVG and zoom  ===
    const svg: d3.Selection<SVGSVGElement, unknown, null, undefined> = d3.select(this.svgRef.nativeElement);
    const g: d3.Selection<SVGGElement, unknown, null, undefined> = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.02, 10])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    // Attach zoom
    svg.call(zoom);

    // Apply initial transform to center the content
    const initialTransform = d3.zoomIdentity
      .translate(this.svgBounds.width / 2, this.svgBounds.height / 2) // move to screen center
      .scale(1);

    svg.call(zoom.transform, initialTransform);

    this.tooltipWrapper = d3
      .select("app-tree")
      //.append("foreignObject") // SVG doesn't allow div, but 'foreignObject' does
      .append("div")
      .attr("class", "tooltip-wrapper")
      .style("opacity", 0.9);
    let tooltip = this.tooltipWrapper
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

    this.tooltipCloseButton = this.tooltipWrapper
      .append("button")
      .attr("class", "tooltip-btn btn btn-danger")
      .style("display", "none")
      .style("position", "absolute")
      .style("opacity", 0)
      .style("left", `0px`)
      .style("top", "0px")
      .text("✖")
      .on("click", () => this.clearTooltip());

    // === Links  ===
    const linkGen = d3
      .linkRadial<unknown, d3.HierarchyPointNode<Astre>>()
      .angle((d) => d.x)
      .radius((d: d3.HierarchyPointNode<Astre>) => d.y);
    const links = g
      .selectAll(".link")
      .data(rootPoint.links()) // gives array of {source, target}
      .join("path")
      .attr("class", "link")
      .attr("fill", "none") // mandatory in this style of links
      .attr("d", (link: d3.HierarchyPointLink<Astre>) => linkGen(link))
      .attr("stroke", (link: d3.HierarchyPointLink<Astre>) => {
        return computeBranchColor(link); //d3.hsl(0, 1, 0.9, 1).darker(d.target.depth).clamp().formatHsl();
      })
      .attr("stroke-width", linkConfig.stroke.width);
    // Draw nodes
    const nodeG = g
      .append("g")
      .selectAll("g.node")
      .data(rootPoint.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d: d3.HierarchyPointNode<Astre>) => {
        const [x, y] = d3.pointRadial(d.x, d.y);
        return `translate(${x},${y})`;
      });

    nodeG
      .append("circle")
      .attr("r", 15)
      .text((d: any) => d.id)
      .attr("opacity", 0); // Fake increased hitbox
    nodeG.append("circle").attr("r", 3).attr("opacity", 0.5);
    nodeG
      .append("text")
      .attr("dy", -10)
      .text((d: any) => d.id)
      .attr("opacity", "0.1")
      .attr("font-weight", 300)
      .attr("fill", "#000000ff");

    // Node Events
    nodeG
      .on("click", (event: MouseEvent, pointNode: d3.HierarchyPointNode<Astre>) => {
        //let t = event.currentTarget as SVGElement;

        this.tooltipCloseButton.style("display", "block");
        const anchor = nodeG
          .select("circle")
          .filter((node: d3.HierarchyPointNode<Astre>) => node.data.astreID == pointNode.data.astreID)
          .data()[0];
        this.renderTooltip(tooltip, pointNode, event, anchor);
        tooltip.transition().duration(200).style("opacity", 0.9);
        this.tooltipPinned = true;

        let currentNode = pointNode;
        while (currentNode.parent != null) {
          links
            .filter((s) => s.target == currentNode) // Bad for optimisation to not filter, but helps against race-condition/double-trigger
            .transition()
            .attr("stroke-width", linkConfig.stroke.width);
          currentNode = currentNode.parent;
        }
      })

      .on("mouseover", (event: MouseEvent, pointNode: d3.HierarchyPointNode<Astre>) => {
        let target = event.currentTarget as SVGElement;

        // Rainbow Path
        linkConfig.stroke.rainbowLoop = true;
        let currentNode = pointNode;
        while (currentNode.parent != null) {
          links
            .filter((s: d3.HierarchyPointLink<Astre>) => s.target == currentNode)
            .transition()
            .attr("stroke-width", linkConfig.stroke.widthHover)
            .transition()
            .on("end", function (link: d3.HierarchyPointLink<Astre>) {
              const sel = d3.select<SVGPathElement, d3.HierarchyLink<Astre>>(this as SVGPathElement);
              rainbowLoop(sel, "stroke", link);
            });
          currentNode = currentNode.parent;
        }

        const g = d3.select(target);
        g.select("text").transition().ease(d3.easeExpOut).attr("opacity", "1").attr("font-weight", 700);

        this.tooltipWrapper.style("display", "block");
        this.tooltipWrapper.transition().duration(200).style("opacity", 0.9);
        if (!this.tooltipPinned) {
          this.tooltipAnchor = nodeG
            .select("circle")
            .filter((node: d3.HierarchyPointNode<Astre>) => node.data.astreID == pointNode.data.astreID)
            .data()[0];
          // Show tooltip
          this.renderTooltip(tooltip, pointNode, event, this.tooltipAnchor);
        }
      })

      .on("mouseout", (event: any, pointNode: d3.HierarchyPointNode<Astre>) => {
        if (!this.tooltipPinned) {
          this.clearTooltip();
        }
        let target: Element = event.currentTarget;

        // Clear Rainbow path
        linkConfig.stroke.rainbowLoop = false;
        let currentNode = pointNode;
        while (currentNode.parent != null) {
          links
            .filter((s) => s.target == currentNode) // Bad for optimisation to not filter, but helps against race-condition/double-trigger
            .transition()
            .attr("stroke-width", linkConfig.stroke.width)
            .attr("stroke", (link: d3.HierarchyPointLink<Astre>) => {
              return computeBranchColor(link);
            });
          currentNode = currentNode.parent;
        }

        const g = d3.select(target);
        g.select("text")
          .transition()
          .ease(d3.easeExpOut)
          .attr("opacity", "0.2")
          .attr("fill", "#000000ff")
          .attr("font-weight", 300);
      });
  }
}
