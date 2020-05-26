import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Related} from '../../models/Related';
import {Property} from '../../models/Property';
import {ConceptService} from '../../concept.service';
import {LoggerService} from 'dds-angular8/logger';
import {Concept} from '../../models/Concept';
import * as nomnoml from 'nomnoml';
// import * as d3 from 'd3';

@Component({
  selector: 'app-data-model-navigator',
  templateUrl: './data-model-navigator.component.html',
  styleUrls: ['./data-model-navigator.component.scss']
})
export class DataModelNavigatorComponent implements OnInit {
  @Input()
  set conceptIri(iri: string) {
    // if (this.iri !== iri) {
      this.iri = iri;
      this.refresh();
    // }
  }
  @Output() selection: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('svg', {static: true}) targetCanvas: ElementRef;

  pad = 16;

  iri: string;
  concept: Concept;
  definition: Related[];
  properties: Property[];
  sources: Related[];
  clickData: Concept[];

  constructor(private service: ConceptService,
              private log: LoggerService) {
  }

  ngOnInit() {
  }

  refresh() {
    this.concept = this.definition = this.properties = this.sources = null;
    this.targetCanvas.nativeElement.innerHTML = 'Loading...';
/*
    const svg = d3.select('svg');
    svg.selectAll('*').remove();
*/

    this.service.getConcept(this.iri).subscribe(
      (result) => {
        this.concept = result;
        this.redraw();
      },
      (error) => this.log.error(error)
    );

    this.service.getDefinition(this.iri).subscribe(
      (result) => {
        this.definition = result;
        this.redraw();
      },
      (error) => this.log.error(error)
    );

    this.service.getProperties(this.iri).subscribe(
      (result) => {
        this.properties = result;
        this.redraw();
      },
      (error) => this.log.error(error)
    );

    this.service.getSources(this.iri, [], 15, 1).subscribe(
      (result) => {
        this.sources = result;
        this.redraw();
      },
      (error) => this.log.error(error)
    );
  }



  onResized(event) {
    // this.redraw();
  }

  navigate(iri: string) {
    this.selection.emit(iri);
  }

  redraw() {
    if (this.concept && this.definition && this.properties && this.sources) {
      this.buildSvg();
    }
  }

  buildSvg() {
    this.clickData = [];
    let s = '#font: Calibri\n' +
      '#fontSize: 10\n' +
      '#lineWidth: 1\n' +
      '#direction: right\n' +
      '#.hide: visual=hidden empty\n' +
      '#.concept: visual=roundrect fill=lightgreen\n' +
      '#.related: visual=roundrect fill=lightblue\n';
    if (this.sources.length > 0) {
      s += '[<hide> ----------PADDED DISPLAY SOURCE----------]-/-[<hide> ----------PADDED DISPLAY CONCEPT----------]\n';
    }

    if (this.definition.length > 0) {
      s += '[<hide> ----------PADDED DISPLAY CONCEPT----------]-/-[<hide> ----------PADDED DISPLAY TARGET----------]\n';
    }

    // Concept
    s += '[<concept> ' + this.concept.name;

    if (this.properties.length > 0) {
      s += '|\n';
      this.properties.forEach((prp, i) => {
        s += prp.property.name + ': ' + prp.valueType.name;
        if (i < this.properties.length - 1) {
          s += ';\n';
        } else {
          s += '\n';
        }
      });
    }
    s += ']\n';

    // Sources
    this.sources.forEach((src, i) => {
      s += '[<related> ' + this.addClick(src.concept) + '] ' + src.relationship.name + ' +-> [<concept> ' + this.concept.name + ']\n';
    });

    // Targets
    this.definition.forEach((def, i) => {
      s += '[<concept> ' + this.concept.name + '] ' + def.relationship.name + ' +-> [<related> ' + this.addClick(def.concept) + ']\n';
    });

    this.render(s);
  }

  addClick(concept: Concept) {
    this.clickData.push(concept);
    return '{' + (this.clickData.length - 1) + '}' + concept.name;
  }

  render(s: string) {
    let svg = nomnoml.renderSvg(s);

    svg = svg.replace('<svg ', '<svg width="100%" height="100%" ');

    // Inject ids
    this.clickData.forEach((c, i) => {
      svg = svg.replace('>{' + i + '}', ' id="click_' + i + '">');
    });

    // Add to dom
    this.targetCanvas.nativeElement.innerHTML = svg;

    // Inject click events
    this.clickData.forEach((c, i) => {
      const item = document.querySelector('#click_' + i);
      item.addEventListener('click', () => this.selection.emit(c), false);
    });
  }

  /*
  buildSvg() {
    const svg = d3.select('svg');
    svg.selectAll('*').remove();

    const src = this.buildRelated(svg, this.sources, '15.67%');

    const def = this.buildRelated(svg, this.definition, '84.33%');

    const cpt = this.buildConcept(svg);

    this.buildConnectors(svg, '15.67%', src / 2, -cpt / 2, this.sources);
    this.buildConnectors(svg, '84.33%', -def / 2, cpt / 2, this.definition);

  }

  buildConnectors(svg, x1, w1, w2, rel: Related[]) {
    const c = rel.length;

    const wg = svg.append('g');
    const ts = wg.append('svg');

    for (let i = 0; i < c; i++) {
      const y = i * 30;
      // Lines
      ts.append('line')
        .attr('x1', 'calc(' + x1 + ' + ' + w1 + ')')
        .attr('y1', (30 * i) + 15)
        .attr('x2', 'calc(50% + ' + (w2 * 1.5) + ')')
        .attr('y2', (30 * i) + 15)
        .attr('stroke', 'red');

      ts.append('line')
        .attr('x1', 'calc(50% + ' + (w2 * 1.5) + ')')
        .attr('y1', (30 * i) + 15)
        .attr('x2', 'calc(50% + ' + (w2 * 1.5) + ')')
        .attr('y2', (15 * (c - 1)) + 15)
        .attr('stroke', 'red');

      ts.append('line')
        .attr('x1', 'calc(50% + ' + (w2 * 1.5) + ')')
        .attr('y1', (15 * (c - 1)) + 15)
        .attr('x2', 'calc(50% + ' + w2 + ')')
        .attr('y2', (15 * (c - 1)) + 15)
        .attr('stroke', 'red');

      // Text
      const t = ts.append('text')
        .text(rel[i].relationship.name)
        .attr('x', x1)
        .attr('y', y + 10);

      if (w1 > 0) {
        t.attr('transform', 'translate(' + (w1 + this.pad) + ' 0)');
      } else {
        const l = t.node().getComputedTextLength();
        t.attr('transform', 'translate(' + (w1 - this.pad - l) + ' 0)');
      }
    }

    ts.attr('y', 'calc(50% - ' + (c * 15)  + ')');
  }

  buildRelated(svg, relList: Related[], xPos) {
    const wg = svg.append('g');
    const ws = wg.append('svg')
    .attr('x', xPos)
      .attr('y', '50%');
    let w = 0;
    for (let i = 0; i < relList.length; i++) {
      const rel = relList[i];

      const g = ws.append('g');

      const s = g.append('svg')
        .on('click', (e) => this.nodeClick(rel.concept));

      const r = s.append('rect')
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('height', 25)
        .attr('fill', 'green')
        .attr('stroke', 'black');

      const t = s.append('text')
        .text(rel.concept.name)
        .attr('x', this.pad)
        .attr('y', 18);

      const l = t.node().getComputedTextLength() + (this.pad * 2);

      if (l > w) {
        w = l;
      }

      s.attr('y', i * 30);
    }
    ws.selectAll('rect')
      .attr('width', w);

    wg.attr('transform', 'translate(-' + (w / 2) + ' -' + (relList.length * 15) + ')');

    return w;
  }

  buildConcept(svg) {
    const g = svg.append('g');

    const s  = g.append('svg')
      .attr('x', '50%')
      .attr('y', '50%');

    const r = s.append('rect')
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('height', 25 + (25 * this.properties.length))
      .attr('fill', 'lightblue')
      .attr('stroke', 'black');

    const t = s.append('text')
      .text(this.concept.name)
      .attr('font-weight', 'bold')
      .attr('x', this.pad)
      .attr('y', 18);

    let w = t.node().getComputedTextLength() + (this.pad * 2);

    for (let i = 0; i < this.properties.length; i++) {
      const p = s.append('text')
        .text(this.properties[i].property.name + ' -> ' + this.properties[i].valueType.name)
        .attr('x', this.pad)
        .attr('y', 43 + (25 * i));

      const l = p.node().getComputedTextLength() + (this.pad * 2);

      if (l > w) {
        w = l;
      }
    }

    w = Math.round(w);

    if (this.properties.length > 0) {
      s.append('line')
        .attr('x1', '0')
        .attr('y1', '25')
        .attr('x2', w)
        .attr('y2', 25)
        .attr('stroke', 'black');
    }

    r.attr('width', w);
    g.attr('transform', 'translate(-' + (w / 2) + ' -' + ((this.properties.length * 15) + 15) + ')');

    return w;
  }

  nodeClick(concept: any) {
    console.log('Click! : [' + concept.iri + ']');
    this.selection.emit(concept);
  }*/
}
