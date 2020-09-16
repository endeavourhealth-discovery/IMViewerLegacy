import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Related} from '../models/Related';
import {Property} from '../models/Property';
import {LoggerService} from 'dds-angular8/logger';
import {Concept} from '../models/Concept';
import * as d3 from 'd3';
import * as dagre from 'dagre';
import svgPanZoom from 'svg-pan-zoom';
import {Subscription, zip} from 'rxjs';
import {DataModelNavigatorService} from './data-model-navigator.service';

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
    properties: Property[];
    sources: Related[];
    targets: Related[];
    obs: Subscription = null;
    showProperties: boolean = false;

    constructor(private service: DataModelNavigatorService,
                private log: LoggerService) {
    }

    ngOnInit() {
    }

    refresh() {
        if (this.obs) {
            this.obs.unsubscribe();
            this.obs = null;
        }
        this.concept = this.properties = this.sources = this.targets = null;
        this.clearSvg();

        this.obs = zip(
            this.service.getConcept(this.iri),
            this.service.getProperties(this.iri, true),
            this.service.getSources(this.iri, [], 15, 1),
            this.service.getTargets(this.iri, [], 15, 1)
        ).subscribe(
            (result) => {
                this.concept = result[0];
                this.properties = result[1];
                this.sources = result[2].result;
                this.targets = result[3].result;
                this.redraw();
                this.obs = null;
            },
            (error) => this.log.error(error)
        );
    }

    redraw() {
        if (this.concept && this.properties && this.sources && this.targets) {
            this.buildSvg();
        }
    }

    clearSvg() {
        svgPanZoom('#panZoom').reset();
        this.targetCanvas.nativeElement.innerHTML = '<svg id="panZoom" width="100%" height="100%"></svg>';
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
        const map: Map<string, any> = new Map();

        this.buildConcept(svg, graph, map);

        this.buildRelated(svg, graph, map, this.sources, false);

        const tgts = (!this.showProperties)
            ? this.targets
            : this.targets.filter(
            (el) => this.properties.findIndex((
                p) => (p.valueType.iri == el.concept.iri) && (p.property.iri == el.relationship.iri)
            ) < 0);
        this.buildRelated(svg, graph, map, tgts, true);

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

    buildRelated(svg, graph, map: Map<string, any>, relList: Related[], reverse: boolean) {
        for (const rel of relList) {
            // Dont add node if already exists
            if (!map.has(rel.concept.iri)) {
                const g = svg.append('g');

                const s = g.append('svg')
                    .attr('class', 'clickable')
                    .on('click', () => this.nodeClick(rel.concept.iri));

                const r = s.append('rect')
                    .attr('rx', 6)
                    .attr('ry', 6)
                    .attr('height', 25)
                    .attr('stroke', 'black');

                if (rel.relationship.iri === 'sn:116680003')
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
                graph.setNode(rel.concept.iri, {label: rel.concept.name, width: w, height: 25});

                map.set(rel.concept.iri, s);
            }

            const relId = (reverse) ? rel.concept.iri + '-' + this.concept.iri : this.concept.iri + '-' + rel.concept.iri;

            // Dont add relationship if already exists
            if (!map.has(relId)) {
                const relName = rel.relationship.name + this.cardText(rel.minCardinality, rel.maxCardinality);

                const l = svg.append('text')
                    .text(relName)
                    .attr('font-size', 10)
                    .attr('height', 12)
                    .attr('class', 'clickable')
                    .on('click', () => this.nodeClick(rel.relationship.iri));

                const lw = l.node().getComputedTextLength();
                l.attr('width', lw);

                if (reverse) {
                    graph.setEdge(rel.concept.iri, this.concept.iri, {label: relName, width: lw, height: 12});
                    map.set(relId, l);
                } else {
                    graph.setEdge(this.concept.iri, rel.concept.iri, {label: relName, width: lw, height: 12});
                    map.set(relId, l);
                }
            }
        }
    }

    buildConcept(svg, graph, map: Map<string, any>) {
        const g = svg.append('g');

        const s = g.append('svg');

        const r = s.append('rect')
            .attr('rx', 6)
            .attr('ry', 6)
            .attr('fill', 'lightblue')
            .attr('stroke', 'black');

        const t = s.append('text')
            .text(this.concept.name)
            .attr('font-weight', 'bold')
            .attr('font-size', 12)
            .attr('x', this.pad)
            .attr('y', 16);

        let w = t.node().getComputedTextLength() + (this.pad * 2) + 8;

        let height = 25;

        if (this.showProperties && this.properties.length > 0) {
            const __ret = this.addPropertiesIntoConceptDiagram(s, w, height);
            w = __ret.w;
            height = __ret.height;
        } else {
            const __ret = this.addRelationshipProperties(s, w, height);
            w = __ret.w;
            height = __ret.height;
        }
        w = Math.round(w);

        r.attr('width', w)
            .attr('height', height)

        s.append('polygon')
            .attr('points', (this.showProperties)
                ? [[w-18, 8], [w-8, 8], [w-13, 18]]
                : [[w-18, 8], [w-8, 13], [w-18, 18]]
            )
            .attr('fill', 'black')
            .attr('stroke', 'black')
            .on('click', () => this.toggleProperties());

        graph.setNode(this.concept.iri, {label: this.concept.name, width: w, height: height});
        map.set(this.concept.iri, s);
    }

    private addPropertiesIntoConceptDiagram(s, w: number, height: number) {
        let lastOwner = this.concept.iri;
        let i = 0;
        for (let property of this.properties) {
            let l = this.pad;

            if (property.owner.iri != lastOwner) {
                lastOwner = property.owner.iri;
                const o = s.append('text')
                    .text('Inherited from ' + property.owner.name + ':')
                    .attr('font-size', 10)
                    .attr('font-style', 'italic')
                    .attr('font-weight', 'bold')
                    .attr('x', l)
                    .attr('y', 38 + (20 * i))
                    .attr('class', 'clickable')
                    .on('click', () => this.nodeClick(property.owner.iri));
                o.insert('title')
                    .text(property.owner.name);

                i++;
            }

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

            l += this.pad;

            if (l > w) {
                w = l;
            }

            i++;
        }

        s.append('line')
            .attr('x1', 0)
            .attr('y1', 22)
            .attr('x2', w)
            .attr('y2', 22)
            .attr('stroke', 'black');

        height += (20 * i);
        return {w, height};
    }

    private addRelationshipProperties(s, w: number, height: number) {
        return {w, height};
    }

    toggleProperties() {
        this.showProperties = !this.showProperties;
        this.clearSvg();
        this.buildSvg();
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
