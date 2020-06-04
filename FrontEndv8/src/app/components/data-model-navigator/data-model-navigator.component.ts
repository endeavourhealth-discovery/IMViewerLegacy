import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Related} from '../../models/Related';
import {Property} from '../../models/Property';
import {ConceptService} from '../../concept.service';
import {LoggerService} from 'dds-angular8/logger';
import {Concept} from '../../models/Concept';
import * as d3 from 'd3';
import * as dagre from 'dagre';
import * as svgPanZoom from 'svg-pan-zoom';
import {Observable, Subscription, zip} from 'rxjs';

@Component({
  selector: 'app-data-model-navigator',
  templateUrl: './data-model-navigator.component.html',
  styleUrls: ['./data-model-navigator.component.scss']
})
export class DataModelNavigatorComponent implements OnInit {
  @Input()
  set conceptIri(iri: string) {
      this.iri = iri;
      this.refresh();
  }
  @Output() selection: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('svg', {static: true}) targetCanvas: ElementRef;

  pad = 16;

  iri: string;
  concept: Concept;
  definition: Related[];
  properties: Property[];
  sources: Related[];
  targets: Related[];
  obs: Subscription = null;

  constructor(private service: ConceptService,
              private log: LoggerService) {
  }

  ngOnInit() {
  }

  refresh() {
    if (this.obs) {
      this.obs.unsubscribe();
      this.obs = null;
    }
    this.concept = this.definition = this.properties = this.sources = this.targets = null;
    svgPanZoom('#panZoom').reset();
    this.targetCanvas.nativeElement.innerHTML = '<svg id="panZoom" width="100%" height="100%"></svg>';

    this.obs = zip(this.service.getConcept(this.iri),
    this.service.getDefinition(this.iri),
    this.service.getProperties(this.iri, true),
    this.service.getSources(this.iri, [], 15, 1),
    this.service.getTargets(this.iri, [], 15, 1)
    ).subscribe(
      (result) => {
        this.concept = result[0];
        this.definition = result[1];
        this.properties = result[2];
        this.sources = result[3].result;
        this.targets = result[4].result;
        this.redraw();
        this.obs = null;
      },
      (error) => this.log.error(error)
    );
  }

  redraw() {
    if (this.concept && this.definition && this.properties && this.sources && this.targets) {
      this.buildSvg();
    }
  }


  buildSvg() {
    // D3
    const svg = d3.select('svg');

    // Arrowhead
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0, 0, 10, 10')
      .attr('refX', 10)
      .attr('refY', 5)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', d3.line()([[0, 0], [0, 10], [10, 5]]))
      .attr('stroke', 'black');

    // Layout engine
    const graph = new dagre.graphlib.Graph();
    graph.setGraph({
      rankdir: 'LR',
      nodesep: 10
    });
    graph.setDefaultEdgeLabel(() => ({}));

    // Nodemap
    const map = new Map();

    this.buildConcept(svg, graph, map);

    this.buildRelated(svg, graph, map, this.sources, false);

    this.buildRelated(svg, graph, map, this.targets, true);

    dagre.layout(graph);

    graph.nodes().forEach(v => {
      const g = map.get(v);
      const i = graph.node(v);
      g.attr('x', i.x - (i.width / 2))
       .attr('y', i.y - (i.height / 2));
    });

    const lf = d3.line<any>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveLinear);

    graph.edges().forEach(e => {
      const i = graph.edge(e);

      svg.append('path')
        .attr('d', lf(i.points))
        .attr('stroke', 'grey')
        .attr('fill', 'none')
        .attr('marker-start', 'url(#arrow)');

      const l = map.get(e.v + '-' + e.w);
      l.attr('x', i.x - (i.width / 2))
        .attr('y', i.y);
    });

    svgPanZoom('#panZoom', {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: false,
      center: true
    });
  }

  buildRelated(svg, graph, map, relList: Related[], reverse: boolean) {
    for (const rel of relList) {

      const g = svg.append('g');

      const s = g.append('svg')
        .attr('class', 'clickable')
        .on('click', () => this.nodeClick(rel.concept.iri));

      const r = s.append('rect')
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('height', 25)
        .attr('stroke', 'black');

      if (rel.relationship.iri === ':SN_116680003')
        r.attr('fill', 'lightgreen')
      else
        r.attr('fill', 'orange')


      const t = s.append('text')
        .text(rel.concept.name)
        .attr('font-size', 12)
        .attr('x', this.pad)
        .attr('y', 18);

      const w = t.node().getComputedTextLength() + (this.pad * 2);
      r.attr('width', w);

      const relName = rel.relationship.name + this.cardText(rel.minCardinality, rel.maxCardinality);

      const l = svg.append('text')
        .text(relName)
        .attr('font-size', 10)
        .attr('height', 12)
        .attr('class', 'clickable')
        .on('click', () => this.nodeClick(rel.relationship.iri));

      const lw = l.node().getComputedTextLength();
      l.attr('width', lw);

      graph.setNode(rel.concept.iri, {label: rel.concept.name, width: w, height: 25});
      if (reverse) {
        graph.setEdge(rel.concept.iri, this.concept.iri, {label: relName, width: lw, height: 12});
        map.set(rel.concept.iri + '-' + this.concept.iri, l);
      } else {
        graph.setEdge(this.concept.iri, rel.concept.iri, {label: relName, width: lw, height: 12});
        map.set(this.concept.iri + '-' + rel.concept.iri, l);
      }

      map.set(rel.concept.iri, s);
    }
  }

  buildConcept(svg, graph, map) {
    const g = svg.append('g');

    const s  = g.append('svg');

    const r = s.append('rect')
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('height', 25 + (20 * this.properties.length))
      .attr('fill', 'lightblue')
      .attr('stroke', 'black');

    const t = s.append('text')
      .text(this.concept.name)
      .attr('font-weight', 'bold')
      .attr('font-size', 12)
      .attr('x', this.pad)
      .attr('y', 16);

    let w = t.node().getComputedTextLength() + (this.pad * 2);

    for (let i = 0; i < this.properties.length; i++) {
      const property = this.properties[i];
      let l = this.pad;

      const p = s.append('text')
        .text(property.property.name + ': ')
        .attr('font-size', 12)
        .attr('x', l)
        .attr('y', 38 + (20 * i))
        .attr('class', 'clickable')
        .on('click', () => this.nodeClick(property.property.iri));

      if (property.level >= 0) {
        p.attr('fill', 'grey');
      }

      l += p.node().getComputedTextLength() + 4;

      const pt = s.append('text')
        .text(property.valueType.name + this.cardText(property.minCardinality, property.maxCardinality))
        .attr('font-size', 12)
        .attr('x', l)
        .attr('y', 38 + (20 * i))
        .attr('class', 'clickable')
        .on('click', () => this.nodeClick(property.valueType.iri));

      if (property.level >= 0) {
        pt.attr('fill', 'grey');
      }

      l += pt.node().getComputedTextLength() + 4;

      if (property.level >= 0) {
        const o = s.append('text')
          .text('(inherited)')
          .attr('font-size', 10)
          .attr('font-style', 'italic')
          .attr('x', l)
          .attr('y', 38 + (20 * i))
          .attr('class', 'clickable')
          .attr('fill', 'grey')
          .on('click', () => this.nodeClick(property.owner.iri));
        o.insert('title')
          .text(property.owner.name);

        l += o.node().getComputedTextLength() + (this.pad);
      }

      if (l > w) {
        w = l;
      }
    }

    w = Math.round(w);

    if (this.properties.length > 0) {
      s.append('line')
        .attr('x1', 0)
        .attr('y1', 22)
        .attr('x2', w)
        .attr('y2', 22)
        .attr('stroke', 'black');
    }

    r.attr('width', w);

    graph.setNode(this.concept.iri, {label: this.concept.name, width: w, height: 25 + (20 * this.properties.length)});
    map.set(this.concept.iri, s);
  }

  cardText(min: number, max: number): string {
    // Same, non-null
    if (min === max && min != null)
      return '[' + min + ']';

    // Create in 'm..n' format
    let card = ((min === null) ? '0' : min)
      + '..'
      + ((max === null) ? '*' : max);

    // Replace shorthands
    if (card === '0..0')
      card = '0';
    else if (card === '0..*')
      card = '*';

    return '[' + card + ']';
  }

  nodeClick(iri: string) {
    this.selection.emit(iri);
  }
}
