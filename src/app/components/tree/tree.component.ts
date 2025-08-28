import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  SimpleChanges,
} from "@angular/core";
import { Store } from "@ngrx/store";
import * as d3 from "d3";
import { ToastrService } from "ngx-toastr";
import { Observable, take } from "rxjs";
import { Astre } from "src/app/models/Astre";
import { loadAstres } from "src/app/store/astre.actions";
import { selectAstres } from "src/app/store/astre.selectors";

@Component({
  selector: "app-tree",
  template: `
    <div class="tree-wrapper">
      <svg #svgContainer style="width:90vw; height:90vh;"></svg>
    </div>
  `,
})
export class TreeComponent implements AfterViewInit {
  @ViewChild("svgContainer", { static: true })
  svgRef!: ElementRef<SVGSVGElement>;
  public allAstres$: Observable<Astre[]> = this.store.select(selectAstres);
  public astres: Astre[];

  childColumn = "";
  parentColumn = "";
  bounds: any;
  constructor(private store: Store, private toastr: ToastrService) {}

  ngOnInit() {
    this.store.dispatch(loadAstres());
    this.allAstres$ = this.store.select(selectAstres);
    this.allAstres$.pipe(take(1)).forEach((a) => (this.astres = a));
    this.astres = this.astres.filter((a) => a.astreID.type == "topic");
  }
  ngAfterViewInit(): void {
    const svgElement = this.svgRef.nativeElement as SVGSVGElement;
    // get actual pixel dimensions from browser layout
    this.bounds = svgElement.getBoundingClientRect();
    this.initTree();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.allAstres$.pipe(take(1)).forEach((a) => (this.astres = a));
    this.initTree();
    if (changes["astres"] && this.astres?.length) {
      this.initTree();
    }
  }

  separation(a: Astre, b: Astre) {
    return a.parent == b.parent ? 1 : 2;
  }
  initTree(): void {
    console.log("init tree");
    console.log(this.astres.length);
    if (this.astres.length === 0) return;

    console.log(this.astres);
    this.childColumn = "astreid.name";
    this.parentColumn = "parent";
    const ids = new Set(this.astres.map((d) => d.astreID.name));

    const [validAstres, invalidAstres] = this.astres.reduce(
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
          Array.from(
            invalidAstres.map(
              (astre) => astre.astreID.type + "-" + astre.astreID.name
            )
          ).join(" | "),
        "Invalid Nodes",
        { disableTimeOut: true }
      );
    }

    // === Create Tree ===
    const root = d3
      .stratify<Astre>()
      .id((d: Astre) => d.astreID.name)
      .parentId((d: Astre) => d.parent)(validAstres);

    const radius = 10 * validAstres.length;
    const tree = d3
      .tree<Astre>()
      .size([2 * Math.PI, radius])
      .separation(
        (a, b) =>
          (a.parent === b.parent ? 1 : 1.5) / Math.min(a.depth, b.depth + 1)
      );
    const rootPoint = tree(root as d3.HierarchyNode<Astre>);

    // === Select SVG and zoom  ===
    const svg = d3.select(this.svgRef.nativeElement);
    const g = svg.append("g");

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
      .translate(this.bounds.width / 2, this.bounds.height / 2) // move to screen center
      .scale(1);

    svg.call(zoom.transform, initialTransform);

    // === Links  ===
    const linkGen = d3
      .linkRadial<unknown, d3.HierarchyPointNode<Astre>>()
      .angle((d) => d.x)
      .radius((d) => d.y);
    g.selectAll(".link")
      .data(rootPoint.links()) // gives array of {source, target}
      .enter() // enter the array
      .append("path")
      .attr("class", "link")
      .attr("fill", "none") // mandatory in this style of links
      .attr("d", (d) => linkGen(d))
      .attr("stroke", (d) =>
        d3
          .hsl(0, 1, 0.75, 1)
          .darker(d.target.depth * 2)
          .clamp()
          .formatHex()
      )
      .attr("stroke-width", 1);

    // Draw nodes
    const nodeG = g
      .append("g")
      .selectAll("g.node")
      .data(rootPoint.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => {
        const [x, y] = d3.pointRadial(d.x, d.y);
        return `translate(${x},${y})`;
      });

    nodeG.append("circle").attr("r", 3).attr("opacity", "1");
    nodeG
      .append("text")
      .attr("dy", -10)
      .text((d: any) => d.id)
      .attr("opacity", "0.2")
      .attr("font-weight", 300)
      .attr("fill", "#000000ff");

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(255, 255, 255, 0.9)")
      .style("padding", "6px 10px")
      .style("border-radius", "4px")
      .style("pointer-events", "none") // Mouse pass-through
      .style("opacity", 0)
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .style("color", "#000000");

    nodeG
      .on("mouseover", (event, pointNode: d3.HierarchyPointNode<Astre>) => {
        var t = event.currentTarget;
        const g = d3.select(t);
        g.select("text")
          .transition()
          .ease(d3.easeExpOut)
          .attr("opacity", "1")
          .attr("font-weight", 700);

        // Show tooltip
        tooltip.transition().duration(200).style("opacity", 0.9);
        var currentAstre: Astre = pointNode.data as Astre;
        tooltip
          .html(
            `${currentAstre.astreID.name} ></br>
            [${currentAstre.tags}] from
            ${currentAstre.parent} > </br>
            ${currentAstre.description}  `
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 30 + "px");
      })
      .on("mouseout", function (d, i) {
        tooltip.transition().duration(200).style("opacity", 0);
        const g = d3.select(this);
        g.select("text")
          .transition()
          .ease(d3.easeExpOut)
          .attr("opacity", "0.2")
          .attr("fill", "#000000ff")
          .attr("font-weight", 300);
      });
  }
}
