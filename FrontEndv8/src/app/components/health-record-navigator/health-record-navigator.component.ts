import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import * as dagre from 'dagre';
import * as svgPanZoom from 'svg-pan-zoom';
import {Subscription, zip} from 'rxjs';
import {NgEventBus} from 'ng-event-bus';
import {Concept} from '../../models/objectmodel/Concept';
import {ConceptReference} from '../../models/objectmodel/ConceptReference';
import {ConceptReferenceNode} from '../../models/objectmodel/ConceptReferenceNode';
import {LoggerService} from '../../services/logger.service';
import {PropertyConstraint} from '../../models/objectmodel/PropertyConstraint';
import {ConceptService} from '../../services/concept.service';

@Component({
  selector: 'app-health-record-navigator',
  templateUrl: './health-record-navigator.component.html',
  styleUrls: ['./health-record-navigator.component.scss'],
})
export class HealthRecordNavigatorComponent implements OnInit {
  @Input()
  concept: Concept;

  @Input()
  set conceptIri(iri: string) {
    this.iri = iri;
    this.refresh();
  }

  @ViewChild('svg', {static: true}) targetCanvas: ElementRef;

  pad = 16;
  textSize = 10;

  iri: string;
  parents: Array<ConceptReference>;
  children: Array<ConceptReferenceNode>;
  obs: Subscription = null;

  constructor(private service: ConceptService, private log: LoggerService, private eventBus: NgEventBus) {
  }

  ngOnInit() {
  }

  refresh() {
    if (this.obs) {
      this.obs.unsubscribe();
      this.obs = null;
    }
    this.concept = this.parents = this.children = null;
    this.targetCanvas.nativeElement.innerHTML = '<svg id="panZoom" width="100%" height="100%"></svg>';

    this.obs = zip(this.service.getConcept(this.iri), this.service.getConceptParentHierarchy(this.iri), this.service.getConceptChildren(this.iri)).subscribe(
      (result) => {
        this.concept = result[0];
        this.parents = result[1];
        // Exclude properties from targets list
        this.children = result[2];
        this.redraw();
        this.obs = null;
      },
      (error) => this.log.error(error)
    );
  }

  redraw() {
    if (this.concept && this.parents && this.children) {
      this.buildSvg();
    }
  }

  buildSvg() {
    // D3
    const svg = d3.select('svg');

    // Arrowhead
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0, 0, 10, 10')
      .attr('refX', 10)
      .attr('refY', 5)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr(
        'd',
        d3.line()([
          [0, 0],
          [0, 10],
          [10, 5],
        ])
      )
      .attr('stroke', 'black');

    // Layout engine
    const graph = new dagre.graphlib.Graph();
    graph.setGraph({
      rankdir: 'LR',
      nodesep: 10,
    });
    graph.setDefaultEdgeLabel(() => ({}));

    // Nodemap
    const map: Map<string, any> = new Map();

    this.buildConcept(svg, graph, map);

    this.buildParents(svg, graph, map, this.parents, true);

    this.buildChildren(svg, graph, map, this.children, false);

    dagre.layout(graph);

    graph.nodes().forEach((v) => {
      const g = map.get(v);
      const i = graph.node(v);
      if (g != undefined) {
        g.attr('x', i.x - i.width / 2).attr('y', i.y - i.height / 2);
      }
    });

    const lf = d3
      .line<any>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveLinear);

    graph.edges().forEach((e) => {
      const i = graph.edge(e);

      svg.append('path').attr('d', lf(i.points)).attr('stroke', 'grey').attr('fill', 'none').attr('marker-start', 'url(#arrow)');

      const l = map.get(e.v + '-' + e.w);
      l.attr('x', i.x - i.width / 2).attr('y', i.y);
    });

    svgPanZoom('#panZoom', {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: false,
      center: true,
      dblClickZoomEnabled: false
    });
  }

  buildParents(svg, graph, map: Map<string, any>, relList: Array<ConceptReference>, reverse: boolean) {
    for (const rel of relList) {
      // Dont add node if already exists
      if (!map.has(rel.iri)) {
        const g = svg.append('g');

        const s = g.append('svg');

        const r = s.append('rect').attr('rx', 6).attr('ry', 6).attr('height', this.textSize * 2).attr('stroke', 'black');

        if (rel.iri === 'sn:116680003') r.attr('fill', 'lightgreen');
        else r.attr('fill', 'orange');

        const wrapper = s.append('g')
          .attr('class', 'clickable')
          .on('click', () => this.nodeClick(rel.iri))
          .on('dblclick', () => this.nodeDblClick(rel.iri));

        const t = wrapper.append('text').text(rel.name).attr('font-size', this.textSize).attr('x', this.pad).attr('y', this.textSize * 1.5);

        const w = t.node().getComputedTextLength() + this.pad * 2;
        r.attr('width', w);
        graph.setNode(rel.iri, {label: rel.name, width: w, height: this.textSize * 2});

        map.set(rel.iri, s);
      }

      const relId = reverse ? rel.iri + '-' + this.concept.iri : this.concept.iri + '-' + rel.iri;

      // Dont add relationship if already exists
      if (!map.has(relId)) {
        const relName = 'Is a' + this.cardText(0, 1);

        const l = svg.append('text').text(relName).attr('font-size', this.textSize * 0.8).attr('height', this.textSize).attr('class', 'clickable');

        const lw = l.node().getComputedTextLength();
        l.attr('width', lw);

        if (reverse) {
          graph.setEdge(rel.iri, this.concept.iri, {label: relName, width: lw, height: this.textSize});
          map.set(relId, l);
        } else {
          graph.setEdge(this.concept.iri, rel.iri, {label: relName, width: lw, height: this.textSize});
          map.set(relId, l);
        }
      }
    }
  }

  buildChildren(svg, graph, map: Map<string, any>, relList: Array<ConceptReferenceNode>, reverse: boolean) {
    for (const rel of relList) {
      // Dont add node if already exists
      if (!map.has(rel.iri)) {
        const g = svg.append('g');

        const s = g.append('svg');

        const r = s.append('rect').attr('rx', this.textSize / 2).attr('ry', this.textSize / 2).attr('height', this.textSize * 2).attr('stroke', 'black');

        if (rel.iri === 'sn:116680003') r.attr('fill', 'lightgreen');
        else r.attr('fill', 'orange');

        const wrapper = s.append('g')
          .attr('class', 'clickable')
          .on('click', () => this.nodeClick(rel.iri))
          .on('dblclick', () => this.nodeDblClick(rel.iri));

        const t = wrapper.append('text').text(rel.name).attr('font-size', this.textSize).attr('x', this.pad).attr('y', this.textSize * 1.5);

        const w = t.node().getComputedTextLength() + this.pad * 2;
        r.attr('width', w);
        graph.setNode(rel.iri, {label: rel.name, width: w, height: this.textSize * 2});

        map.set(rel.iri, s);
      }

      const relId = reverse ? rel.iri + '-' + this.concept.iri : this.concept.iri + '-' + rel.iri;

      // Dont add relationship if already exists
      if (!map.has(relId)) {
        const relName = 'Is a' + this.cardText(0, 1);

        const l = svg.append('text').text(relName).attr('font-size', this.textSize * 0.8).attr('height', this.textSize).attr('class', 'clickable');

        const lw = l.node().getComputedTextLength();
        l.attr('width', lw);

        if (reverse) {
          graph.setEdge(rel.iri, this.concept.iri, {label: relName, width: lw, height: this.textSize});
          map.set(relId, l);
        } else {
          graph.setEdge(this.concept.iri, rel.iri, {label: relName, width: lw, height: this.textSize});
          map.set(relId, l);
        }
      }
    }
  }

  buildConcept(svg, graph, map: Map<string, any>) {
    const g = svg.append('g');

    const s = g.append('svg');

    // Block
    const r = s.append('rect').attr('rx', this.textSize/2).attr('ry', this.textSize/2).attr('fill', 'lightblue').attr('stroke', 'black');

    // Title
    const wrapper = s.append('g').attr('class', 'clickable');
    const t = wrapper.append('text')
      .text(this.concept.name)
      .attr('font-weight', 'bold')
      .attr('font-size', this.textSize)
      .attr('x', this.pad)
      .attr('y', this.textSize * 1.3)
      .on('click', () => this.nodeClick(this.concept.iri))


    let w = t.node().getComputedTextLength() + this.pad * 2;

    let i = 0;

    if (this.concept.Property != null || this.concept.Property != undefined) {
      for (let property of this.concept.Property) {
        let res = this.addPropertyValue(s, property, i, w);
        i = res.i;
        w = res.w;
      }
    }

    w = Math.round(w);

    if (i > 0)
      s.append('line').attr('x1', 0).attr('y1', this.textSize * 1.8).attr('x2', w).attr('y2', this.textSize * 1.8).attr('stroke', 'black');

    r.attr('width', w).attr('height', (this.textSize * 3) + (this.textSize * i));

    graph.setNode(this.concept.iri, {label: this.concept.name, width: w, height: (this.textSize * 3) + (this.textSize * i)});
    map.set(this.concept.iri, s);
  }

  private addPropertyValue(s, pc: PropertyConstraint, i: number, w: number) {
    let l = this.pad;

    let g = s.append('g')
      .attr('class', 'clickable');

    const p = g
      .append('text')
      .text(pc.Property.name + ': ')
      .attr('font-size', this.textSize)
      .attr('x', l)
      .attr('y', (this.textSize * 3) + (this.textSize * i))
      .on('click', () => this.nodeClick(pc.Property.iri))
      .on('dblclick', () => this.nodeDblClick(pc.Property.iri));

    l += p.node().getComputedTextLength() + 4;

    // Type
    let valueType = (pc.ValueClass != null) ? pc.ValueClass : pc.DataType;

    g = s.append('g')
      .attr('class', 'clickable');

    const pt = g
      .append('text')
      .text((valueType.name ? valueType.name : valueType.iri)  + this.cardText(pc.min, pc.max))
      .attr('font-size', this.textSize)
      .attr('x', l)
      .attr('y', (this.textSize * 3) + (this.textSize * i))
      .on('click', () => this.nodeClick(valueType.iri))
      .on('dblclick', () => this.nodeDblClick(valueType.iri));

    l += pt.node().getComputedTextLength() + 4;

    l += this.pad;

    if (l > w) {
      w = l;
    }
    i++;
    return {i, w};
  }

  cardText(min: number, max: number): string {
    // Same, non-null
    if (min === max && min != null) return '[' + min + ']';

    // Create in 'm..n' format
    let card = (min ? min : 0) + '..' + (max ? max : '*');

    // Replace shorthands
    if (card === '0..0') card = '0';
    else if (card === '0..*') card = '*';

    return '[' + card + ']';
  }

  nodeClick(iri: string) {
    this.eventBus.cast('app:conceptSummary', iri);
  }

  nodeDblClick(iri: string) {
    if (iri != null || iri !== undefined) {
      this.eventBus.cast('app:conceptSelect', iri);
    } else {
      this.eventBus.cast('app:conceptSelect', null);
    }
  }
}
