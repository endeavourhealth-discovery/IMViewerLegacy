import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { Concept } from '../../models/objectmodel/Concept';
import { Perspectives } from '../../services/perspective.service';
import { ConceptService } from '../../services/concept.service';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { Perspective } from '../../models/Perspective';
import { LoggerService} from '../../services/logger.service';
import { valueSetServiceProvider } from '../../services/valueset.service.provider';
import { ValueSetService, ValueSet } from '../../services/valueset.service';
import { dataModelServiceProvider } from '../../services/datamodel.service.provider';
import { DataModelProperty, DataModelService } from '../../services/datamodel.service';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

interface ConceptSummaryProvider {
    concept: Concept
    templateName: string
    rootType: string
    
    canSummarise(concept: Concept): Observable<boolean>

}

class BasicSummaryProvider implements ConceptSummaryProvider {
    
    concept: Concept;
    
    static TEMPLATE_NAME:string = "defaultSummaryTemplate";

    constructor(public rootType: string) {}
    
    canSummarise(concept: Concept): Observable<boolean> {
        let canSummarise = new ReplaySubject<boolean>();
        canSummarise.next(true);

        return canSummarise;
    }

    get templateName(): string {
        return BasicSummaryProvider.TEMPLATE_NAME;
    }
    
}

class ValueSetSummaryProvider implements ConceptSummaryProvider {

    valueSet: ValueSet;
    pageStartIndex: number;
    pageEndIndex: number;
    pageSize: number
    pageSizeOptions: number[];

    private _concept: Concept;

    static TEMPLATE_NAME:string = "valueSetSummaryTemplate";

    constructor(private valueSetService: ValueSetService) {
        // pagination
        this.pageSize = 20;
        this.pageSizeOptions = [5, 10, 20];
        this.pageStartIndex = 0;
        this.pageEndIndex = this.pageSize;
    }

    canSummarise(concept: Concept): Observable<boolean> {
        return this.valueSetService.isValueSet(concept);
    }

    get rootType(): string {
        return this.valueSetService.valueSetIri;
    }

    get templateName(): string {
        return ValueSetSummaryProvider.TEMPLATE_NAME;
    }

    set concept(concept: Concept) {
        this._concept = concept;
        this.valueSet = this.valueSetService.toValueSet(concept);
    }

    onPageChange(event: PageEvent): PageEvent {
        this.pageStartIndex = event.pageIndex * event.pageSize;
        this.pageEndIndex = this.pageStartIndex + event.pageSize
    
        return event;
    }
}

class DataModelSummaryProvider implements ConceptSummaryProvider {

    dataModelProperties: DataModelProperty[];  
    columns: string[];
    
    private _concept: Concept;
    
    static TEMPLATE_NAME:string = "dataModelSummaryTemplate";

    constructor(private dataModelService: DataModelService) {
        this.columns = ['name', 'type', 'cardinality'];
    }
    
    canSummarise(concept: Concept): Observable<boolean> {
        return this.dataModelService.isDataModel(concept);
    }

    get rootType(): string {
        return this.dataModelService.dataModelIri;
    }

    get templateName(): string {
        return DataModelSummaryProvider.TEMPLATE_NAME;
    }

    set concept(concept: Concept) {
        this._concept = concept;
        this.dataModelProperties = this.dataModelService.getDataModelProperties(concept);
    }    
}

@Component({
    selector: 'summary-drawer',
    templateUrl: './summary-drawer.component.html',
    styleUrls: ['./summary-drawer.component.scss'],
    providers: [ valueSetServiceProvider, dataModelServiceProvider ]
})
class SummaryDrawerComponent {

    private _concept: Concept;
    private perspective: Perspective;
    private perspectivesMap: Map<string, Perspective>;
    private summaryProviders: Map<string, ConceptSummaryProvider>;
    private defaultSummaryProvider: ConceptSummaryProvider;
    private summaryProvider: ConceptSummaryProvider;
    private _isDrawerOpen: boolean;

    constructor(private service: ConceptService, 
                private perspectives: Perspectives, 
                private log: LoggerService, 
                private valueSetService: ValueSetService,
                private dataModelService: DataModelService,
                private router: Router) {
        this.perspectivesMap = new Map();

        this.summaryProviders = new Map();
        
        const valueSetSummaryProvider: ValueSetSummaryProvider = new ValueSetSummaryProvider(this.valueSetService);
        this.summaryProviders.set(valueSetSummaryProvider.rootType, valueSetSummaryProvider);
        
        const dataModelSummaryProvider: DataModelSummaryProvider = new DataModelSummaryProvider(this.dataModelService);
        this.summaryProviders.set(dataModelSummaryProvider.rootType, dataModelSummaryProvider);
        
        this.defaultSummaryProvider = new BasicSummaryProvider(perspectives.ontology.root); // TODO - is this the right IRI to use for concept?

        this._isDrawerOpen = false;
    }

    @ViewChild(BasicSummaryProvider.TEMPLATE_NAME, { static: true }) 
    defaultSummaryTemplate:TemplateRef<any>;
    
    @ViewChild(ValueSetSummaryProvider.TEMPLATE_NAME, { static: true }) 
    valueSetSummaryTemplate:TemplateRef<any>;

    @ViewChild(DataModelSummaryProvider.TEMPLATE_NAME, { static: true }) 
    dataModelSummaryTemplate:TemplateRef<any>;

    @Input()
    set concept(concept: Concept) {
        this._concept = concept;

        this.getPerspective(this.concept).subscribe(
            perspective => { 

                this.perspective = perspective;

                this.getSummaryProvider(this.perspective.root).subscribe(
                    summaryProvider => this.summaryProvider = summaryProvider 
                );
            }
        ); 
    }

    get concept() {
        return this._concept;
    }

    getSummaryProvider(perspectiveRootIri: string): Observable<ConceptSummaryProvider> {

        
        let summaryProviderObservable: ReplaySubject<ConceptSummaryProvider> = new ReplaySubject();
        let summaryProvider: ConceptSummaryProvider = this.defaultSummaryProvider;
        
        const potentialSummaryProvider = this.summaryProviders.get(perspectiveRootIri);
        if(potentialSummaryProvider != null) {
            potentialSummaryProvider.canSummarise(this.concept).subscribe(
                canSummarise => { 
                    if(canSummarise) {
                        summaryProvider = potentialSummaryProvider;    
                    }
                    else {
                        this.log.debug(`warning - concept summary provider for sub types of ${perspectiveRootIri} cannot summarise the concept ${this.concept.iri}.`);
                    }
                    summaryProvider.concept = this.concept;
                    summaryProviderObservable.next(summaryProvider);
                }
            );
        }
        else {
            this.log.debug("warning - no concept summary provider registered against IRI " + perspectiveRootIri + ". Returning default provider.");

            summaryProvider.concept = this.concept;
            summaryProviderObservable.next(summaryProvider);     
        }

        return summaryProviderObservable;
    }

    gotoConcept(): void {
        let conceptPath: string = this.perspective.path
        if(conceptPath != null) {
            this.router.navigate([conceptPath], { queryParams: { id: this.concept.iri } });
            this.close();
        }
        else {
            this.log.error(`Unable to navigate to concept ${this.concept.iri} as there is no perspective associated with it`);
        }
    }

    close(): void {
        this._isDrawerOpen = false;
    }

    open(): void {
        this._isDrawerOpen = true;;
    }

    get isDrawerOpen(): boolean {
        return this._isDrawerOpen;
    }

    get hasRoute() {
        return this.perspective.path != null;
    }

    private getPerspective(concept: Concept): Observable<Perspective> {
        let perspectiveObservable: Subject<Perspective> = new Subject();
        
        this.perspectives.perspectives.forEach(perspective => this.perspectivesMap.set(perspective.root, perspective));
    
        this.service.isOfType(concept.iri, Array.from(this.perspectivesMap.keys())).subscribe(
          (result) => { 
            if(result.length == 1) {
              perspectiveObservable.next(this.perspectivesMap.get(result[0].iri));
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
}

export {
    SummaryDrawerComponent
};