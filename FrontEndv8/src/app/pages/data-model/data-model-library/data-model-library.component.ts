import { ConceptReferenceNode } from '../../../models/objectmodel/ConceptReferenceNode';
import { DataModelDialogComponent } from '../data-model-create/data-model-dialog/data-model-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConceptService } from '../../../services/concept.service';
import { Concept } from '../../../models/objectmodel/Concept';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DataModelTablularViewComponent } from '../../../components/data-model-tabular-view/data-model-tabular-view.component';
import { NgEventBus } from 'ng-event-bus';
import {LoggerService} from '../../../services/logger.service';
import {Perspectives} from '../../../services/perspective.service';
import {Observable, Subject} from 'rxjs';
import { Perspective } from 'src/app/models/Perspective';
import { FlatProperty } from '../../../models/old/DataModelDefinition';
import { MatTableDataSource } from '@angular/material/table';
import { ClassExpression } from '../../../models/objectmodel/ClassExpression';

const debug = (message: string) => { console.log(message); };

@Component({
  selector: 'app-data-model-library',
  templateUrl: './data-model-library.component.html',
  styleUrls: ['./data-model-library.component.scss'],
})
class DataModelLibraryComponent implements OnInit {

  selectedIri: string;
  concept: Concept;
  parents: Array<ConceptReferenceNode>;
  children: Array<ConceptReferenceNode>;

  searchSize = 72;
  root = ':DiscoveryCommonDataModel';
  relationships = ['sn:116680003'];
  selected = 'dataModel';
  showFiller = true;

  hoveredConcept: Concept = new Concept();
  hoveredPerspective: Perspective;
  hoveredDataModelTableData: any[] = [];
  hoveredDataModelTable: DataTable<FlatProperty>;
  static DEFAULT_MIN_CARDINALITY: number = 0;
  static DEFAULT_MAX_CARDINALITY: string = "*";

  history = [];

  timer: any;
  sidebar = false;

  textual = null;

  @ViewChild(DataModelTablularViewComponent, { static: true }) tableView: DataModelTablularViewComponent;

  constructor(private service: ConceptService,
              public perspectives: Perspectives,
              private router: Router,
              private route: ActivatedRoute,
              private log: LoggerService,
              public dialog: MatDialog,
              private eventBus: NgEventBus) {
    this.routeEvent(this.router);

    this.eventBus.on('app:conceptHover').subscribe((iri: string) => {
      this.itemHover(iri);
    });

    this.hoveredDataModelTable = new DataTable<FlatProperty>(['name', 'type', 'cardinality']);
  }

  routeEvent(router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd && this.concept !== undefined) {
        this.history.unshift(
          {
            url: e.url,
            concept: this.concept
          }
        );
      }
    });
  }

  ngOnInit() {
    this.perspectives.current = this.perspectives.dataModel;
    // Direct URL nav - need to push to tree
    this.route.queryParamMap.subscribe(
      (params) => this.displayConcept(params.get('id') ? params.get('id') : this.root),
      (error) => this.log.error(error)
    );


  }

  displayConcept(iri: string) {
    if (this.selectedIri !== iri) {
      this.selectedIri = iri;
      this.textual = null;
      this.service.getConcept(iri).subscribe(
        (result) => this.concept = result,
        (error) => this.log.error(error)
      );
      this.service.getConceptChildren(iri).subscribe(
        (result) => this.children = result,
        (error) => { this.log.error(error); }
      );

      this.service.getConceptParents(iri).subscribe(
        (result) => this.parents = result,
        (error) => { this.log.error(error); }
      );
    }
  }

  itemHover(iri: string) {
    const root = this;
    if (iri != null) {
      this.timer = setTimeout(() => {
        root.sidebar = true;
      }, 1000);
      this.service.getConcept(iri).subscribe(
        (hoveredConcept) => { 
          this.hoveredConcept = hoveredConcept,
          this.getPerspective(hoveredConcept).subscribe(
            (hoveredPerspective) => { 
              this.hoveredPerspective = hoveredPerspective;
              //console.log("trying to get detail for hov pers", hoveredPerspective.caption);
              //console.log("trying to get detail for hov concept", hoveredConcept.name);

              // TODO - need to then populate the data that backs the popout depending on
              // the perspective - feels like we should defer to the perspective to do this

              // for now do a rough hack where we only deal with datamodels
              if(this.hoveredPerspective.root == this.perspectives.dataModel.root) {
                //console.log("got a datamodel ", JSON.stringify(this.hoveredConcept));
                if (this.hoveredConcept.SubClassOf[0].Intersection != null) {
                  this.hoveredConcept.SubClassOf[0].Intersection.forEach(intersection => {
                    if (intersection.ObjectPropertyValue != null && intersection.ObjectPropertyValue.Property.iri !== ':hasCoreProperties') {
                      this.hoveredDataModelTableData.push(intersection);
                    }
                    if (intersection.ObjectPropertyValue != null && intersection.ObjectPropertyValue.Expression != null && intersection.ObjectPropertyValue.Expression.Intersection != null && intersection.ObjectPropertyValue.Property.iri === ':hasCoreProperties') {
                      intersection.ObjectPropertyValue.Expression.Intersection.forEach(subIntersection => {
                        this.hoveredDataModelTableData.push(subIntersection);
                      });
                    }
                  }); 
                }
              }
            },

            (error) => this.log.error(error)
          )
        },
        (error) => this.log.error(error)
      );
    } else {
      clearTimeout(this.timer);
    }
  }

  goto(iri: string) {
    if (iri !== this.selectedIri) {
      clearTimeout(this.timer);
      this.router.navigate(['dataModel'], { queryParams: { id: iri } });
    }
  }

  gotoConcept() {
    if(this.hoveredConcept.iri.includes(':VSET')) {
      this.router.navigate(['valueSets'], { queryParams: { id: this.hoveredConcept.iri } });
    } else {
      this.router.navigate(['dataModel'], { queryParams: { id: this.hoveredConcept.iri } });
    }
  }

  hasResults(displayed: boolean) {
    this.searchSize = displayed ? 256 : 72;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DataModelDialogComponent, {
      width: '50%',
      data: { parent: this.concept }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // popout functions

  getPerspective(concept: Concept): Observable<Perspective> {
    let perspectiveObservable: Subject<Perspective> = new Subject();
    
    // TODO - cache this - init in constructor
    let perspectivesMap: Map<string, Perspective> = new Map();
    this.perspectives.perspectives.forEach(perspective => perspectivesMap.set(perspective.root, perspective));

    this.service.isOfType(this.hoveredConcept.iri, Array.from(perspectivesMap.keys())).subscribe(
      (result) => { 
        if(result.length == 1) {
          perspectiveObservable.next(perspectivesMap.get(result[0].iri));
        }
        else if(result.length > 1) {
          perspectiveObservable.error("could not determine perspective as the concept (iri: " + concept.iri + ") has multiple perspectives")
        }
        else {
          perspectiveObservable.error("could not determine perspective as the concept (iri: " + concept.iri + ") is not associated with any perspectives")
        }
      }, 
      (error) => { 
          this.log.error(error)
          perspectiveObservable.error("Problem retreiving perspective for concept (iri:" + concept.iri + "). Cause: " + error);
      }
    )
    
    return perspectiveObservable;
  }

  isObjectProperty(row: ClassExpression): boolean {
    return row.ObjectPropertyValue && row.ObjectPropertyValue.Property.iri != null;
  }

  isDataProperty(row: ClassExpression): boolean {
    return row.DataPropertyValue && row.DataPropertyValue.Property.iri != null;
  }

  get DEFAULT_MIN_CARDINALITY(): number {
    return DataModelTablularViewComponent.DEFAULT_MIN_CARDINALITY;
  }

  get DEFAULT_MAX_CARDINALITY(): string {
    return DataModelTablularViewComponent.DEFAULT_MAX_CARDINALITY;
  }
}

class DataTable<D> {

  public columns: string[]
  public rows: MatTableDataSource<D> = new MatTableDataSource<D>();

  constructor(columns: string[]) {
    this.columns = columns;
  }

  setRows(rows: D[]) {
    this.rows.data = rows;
  }

  clear() {
    this.rows.data = [];
  }

  hasRows(): boolean {
    return this.rows && this.rows.data.length > 0;
  }

  getRowCount(): number {
    return (this.hasRows) ? this.rows.data.length : 0;
  }

  getTooltip(concept: Concept): string {
    return `IRI - ${concept.iri} Description - ${concept.description ? concept.description : 'no data found'}`;
  }
}

export {
  DataModelLibraryComponent,
  DataTable
}
