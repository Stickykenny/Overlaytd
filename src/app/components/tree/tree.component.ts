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
      .tree<d3.HierarchyNode<Astre>>()
      .size([2 * Math.PI, radius])
      .separation(
        (a, b) =>
          (a.parent === b.parent ? 1 : 1.5) / Math.min(a.depth, b.depth + 1)
      );
    const rootPoint = tree(root as any);

    // === Select SVG and zoom  ===
    const svg = d3.select(this.svgRef.nativeElement).call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.02, 10]) // min zoom, max zoom
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        })
    );

    const outerG = svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.bounds.width / 2},${this.bounds.height / 2})`
      );

    // 2️⃣ Inner <g> gets zoom/pan
    const g = outerG.append("g");

    // === Links  ===
    const linkGen = d3
      .linkRadial<unknown, d3.HierarchyPointNode<Astre>>()
      .angle((d) => d.x)
      .radius((d) => d.y);

    g.selectAll(".link")
      .data(rootPoint.links()) // gives array of {source, target}
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", (d) => linkGen(d))
      .attr("fill", "none")
      /*.attr("stroke", "#000000ff")*/
      .attr("stroke", (d) => (d.target.depth === 1 ? "red" : "gray"))
      .attr("stroke-opacity", (d) => (d.target.depth === 1 ? 1 : 0.3))
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

    var div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip-donut")
      .style("opacity", 0);
    nodeG
      .append("circle")
      .attr("r", 5)
      // TODO NOT WORKING YET
      .on("mouseover", function (d, i) {
        d3.select(this).transition().attr("opacity", ".85");
        //Makes the new div appear on hover:
        div.transition().style("opacity", 1);
      });

    nodeG
      .append("text")
      .attr("dy", -10)
      .text((d: any) => d.id);
  }
}
