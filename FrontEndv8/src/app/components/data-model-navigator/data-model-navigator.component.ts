import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import * as dagre from 'dagre';
import * as svgPanZoom from 'svg-pan-zoom';
import {Subscription, zip} from 'rxjs';
import {DataModelNavigatorService} from './data-model-navigator.service';
import {NgEventBus} from 'ng-event-bus';
import {Concept} from '../../models/objectmodel/Concept';
import {ConceptReference} from '../../models/objectmodel/ConceptReference';
import {ConceptReferenceNode} from '../../models/objectmodel/ConceptReferenceNode';
import {LoggerService} from '../../services/logger.service';

@Component({
  selector: 'app-data-model-navigator',
  templateUrl: './data-model-navigator.component.html',
  styleUrls: ['./data-model-navigator.component.scss'],
})
export class DataModelNavigatorComponent implements OnInit {
  @Input()
  concept: Concept;

  @Input()
  set conceptIri(iri: string) {
    this.iri = iri;
    this.refresh();
  }

  @ViewChild('svg', {static: true}) targetCanvas: ElementRef;

  pad = 16;

  iri: string;
  parents: Array<ConceptReference>;
  children: Array<ConceptReferenceNode>;
  obs: Subscription = null;

  constructor(private service: DataModelNavigatorService, private log: LoggerService, private eventBus: NgEventBus) {
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

    this.obs = zip(this.service.getConcept(this.iri), this.service.getConceptParents(this.iri), this.service.getConceptChildren(this.iri)).subscribe(
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
    });
  }

  buildParents(svg, graph, map: Map<string, any>, relList: Array<ConceptReference>, reverse: boolean) {
    for (const rel of relList) {
      // Dont add node if already exists
      if (!map.has(rel.iri)) {
        const g = svg.append('g');

        const s = g
          .append('svg')
          .attr('class', 'clickable')
          .on('click', () => this.nodeClick(rel.iri))
          .on('mouseenter', () => this.nodeHover(rel.iri))
          .on('mouseleave', () => this.nodeHover(null));

        const r = s.append('rect').attr('rx', 6).attr('ry', 6).attr('height', 25).attr('stroke', 'black');

        if (rel.iri === 'sn:116680003') r.attr('fill', 'lightgreen');
        else r.attr('fill', 'orange');

        const t = s.append('text').text(rel.name).attr('font-size', 12).attr('x', this.pad).attr('y', 18);

        const w = t.node().getComputedTextLength() + this.pad * 2;
        r.attr('width', w);
        graph.setNode(rel.iri, {label: rel.name, width: w, height: 25});

        map.set(rel.iri, s);
      }

      const relId = reverse ? rel.iri + '-' + this.concept.iri : this.concept.iri + '-' + rel.iri;

      // Dont add relationship if already exists
      if (!map.has(relId)) {
        const relName = 'Is a' + this.cardText(0, 1);

        const l = svg.append('text').text(relName).attr('font-size', 10).attr('height', 12).attr('class', 'clickable');

        const lw = l.node().getComputedTextLength();
        l.attr('width', lw);

        if (reverse) {
          graph.setEdge(rel.iri, this.concept.iri, {label: relName, width: lw, height: 12});
          map.set(relId, l);
        } else {
          graph.setEdge(this.concept.iri, rel.iri, {label: relName, width: lw, height: 12});
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

        const s = g
          .append('svg')
          .attr('class', 'clickable')
          .on('click', () => this.nodeClick(rel.iri))
          .on('mouseenter', () => this.nodeHover(rel.iri))
          .on('mouseleave', () => this.nodeHover(null));

        const r = s.append('rect').attr('rx', 6).attr('ry', 6).attr('height', 25).attr('stroke', 'black');

        if (rel.iri === 'sn:116680003') r.attr('fill', 'lightgreen');
        else r.attr('fill', 'orange');

        const t = s.append('text').text(rel.name).attr('font-size', 12).attr('x', this.pad).attr('y', 18);

        const w = t.node().getComputedTextLength() + this.pad * 2;
        r.attr('width', w);
        graph.setNode(rel.iri, {label: rel.name, width: w, height: 25});

        map.set(rel.iri, s);
      }

      const relId = reverse ? rel.iri + '-' + this.concept.iri : this.concept.iri + '-' + rel.iri;

      // Dont add relationship if already exists
      if (!map.has(relId)) {
        const relName = 'Is a' + this.cardText(0, 1);

        const l = svg.append('text').text(relName).attr('font-size', 10).attr('height', 12).attr('class', 'clickable');

        const lw = l.node().getComputedTextLength();
        l.attr('width', lw);

        if (reverse) {
          graph.setEdge(rel.iri, this.concept.iri, {label: relName, width: lw, height: 12});
          map.set(relId, l);
        } else {
          graph.setEdge(this.concept.iri, rel.iri, {label: relName, width: lw, height: 12});
          map.set(relId, l);
        }
      }
    }
  }

  buildConcept(svg, graph, map: Map<string, any>) {
    const g = svg.append('g');

    const s = g.append('svg');

    // Block
    const r = s.append('rect').attr('rx', 6).attr('ry', 6).attr('fill', 'lightblue').attr('stroke', 'black');

    // Title
    const t = s.append('text').text(this.concept.name).attr('font-weight', 'bold').attr('font-size', 12).attr('x', this.pad).attr('y', 16);

    let w = t.node().getComputedTextLength() + this.pad * 2;

    let lastOwner = this.concept.iri;
    let i = 0;

    if (this.concept.SubClassOf[0].Intersection == null) {
      this.concept.SubClassOf[0].Intersection = [];
    }
    for (let intersection of this.concept.SubClassOf[0].Intersection) {
      if (intersection.ObjectPropertyValue != null) {
        const result = this.addExpression(intersection, s, i, w);
        i = result.i;
        w = result.w;
      }
    }

    w = Math.round(w);

    if (this.concept.SubClassOf[0].Intersection.length > 0) {
      s.append('line').attr('x1', 0).attr('y1', 22).attr('x2', w).attr('y2', 22).attr('stroke', 'black');
    }

    r.attr('width', w).attr('height', 25 + 20 * i);

    graph.setNode(this.concept.iri, {label: this.concept.name, width: w, height: 25 + 20 * i});
    map.set(this.concept.iri, s);
  }

  private addExpression(expression, s, i: number, w: number) {
    if (expression.ObjectPropertyValue.Property.iri === ':hasCoreProperties') {
      for (let intersection of expression.ObjectPropertyValue.Expression.Intersection) {
        if (intersection.ObjectPropertyValue != null) {
          const result = this.addExpression(intersection, s, i, w);
          i = result.i;
          w = result.w;
        }
      }
    } else {

      let l = this.pad;

      const p = s
        .append('text')
        .text(expression.ObjectPropertyValue.Property.name + ': ')
        .attr('font-size', 12)
        .attr('x', l)
        .attr('y', 38 + 20 * i)
        .attr('class', 'clickable')
        .on('click', () => this.nodeClick(expression.ObjectPropertyValue.Property.iri))
        .on('mouseenter', () => this.nodeHover(expression.ObjectPropertyValue.Property.iri))
        .on('mouseleave', () => this.nodeHover(null));

      // if (property.level >= 0) {
      //   p.attr('fill', 'grey');
      // }

      l += p.node().getComputedTextLength() + 4;

      // Type
      if (expression.ObjectPropertyValue.Property.iri !== ':hasCoreProperties') {
        const pt = s
          .append('text')
          .text(expression.ObjectPropertyValue.ValueType.name + this.cardText(expression.ObjectPropertyValue.Min, expression.ObjectPropertyValue.Max))
          .attr('font-size', 12)
          .attr('x', l)
          .attr('y', 38 + 20 * i)
          .attr('class', 'clickable')
          .on('click', () => this.nodeClick(expression.ObjectPropertyValue.ValueType.iri))
          .on('mouseenter', () => this.nodeHover(expression.ObjectPropertyValue.ValueType.iri))
          .on('mouseleave', () => this.nodeHover(null));

        l += pt.node().getComputedTextLength() + 4;
      }

      l += this.pad;

      if (l > w) {
        w = l;
      }
      i++;
    }
    return {i, w};
  }

  cardText(min: number, max: number): string {
    // Same, non-null
    if (min === max && min != null) return '[' + min + ']';

    // Create in 'm..n' format
    let card = (min === null ? '0' : min) + '..' + (max === null ? '*' : max);

    // Replace shorthands
    if (card === '0..0') card = '0';
    else if (card === '0..*') card = '*';

    return '[' + card + ']';
  }

  nodeClick(iri: string) {
    this.eventBus.cast('app:conceptSelect', iri);
  }

  nodeHover(iri: string) {
    if (iri != null || iri !== undefined) {
      this.eventBus.cast('app:conceptHover', iri);
    } else {
      this.eventBus.cast('app:conceptHover', null);
    }
  }
}
