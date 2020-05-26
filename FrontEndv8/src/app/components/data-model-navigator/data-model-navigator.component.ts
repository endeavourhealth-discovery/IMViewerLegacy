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

    this.service.getProperties(this.iri, true).subscribe(
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
        if (prp.level > 0) {
          s += ' (*' + prp.owner.name + ')';
        }

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
}
