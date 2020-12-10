import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { Concept } from '../../models/objectmodel/Concept';
import { Perspectives } from '../../services/perspective.service';
import { ConceptService } from '../../services/concept.service';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { Perspective } from '../../models/Perspective';
import { LoggerService} from '../../services/logger.service';
import { valueSetServiceProvider } from '../../services/valueset.service.provider';
import { ValueSetService, ValueSet } from '../../services/valueset.service';
import { PageEvent } from '@angular/material/paginator';

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

@Component({
    selector: 'summary-drawer',
    templateUrl: './summary-drawer.component.html',
    styleUrls: ['./summary-drawer.component.scss'],
    providers: [ valueSetServiceProvider ]
})
class SummaryDrawerComponent {

    private _concept: Concept;
    private perspective: Perspective;
    private perspectivesMap: Map<string, Perspective>;
    private summaryProviders: Map<string, ConceptSummaryProvider>;
    private defaultSummaryProvider: ConceptSummaryProvider;
    private summaryProvider: ConceptSummaryProvider;

    constructor(private service: ConceptService, 
                private perspectives: Perspectives, 
                private log: LoggerService, 
                private valueSetService: ValueSetService) {
        this.perspectivesMap = new Map();

        const valueSetSummaryProvider: ValueSetSummaryProvider = new ValueSetSummaryProvider(this.valueSetService);
        
        this.summaryProviders = new Map();
        this.summaryProviders.set(valueSetSummaryProvider.rootType, valueSetSummaryProvider);
        
        this.defaultSummaryProvider = new BasicSummaryProvider(perspectives.ontology.root); // TODO - is this the right IRI to use for concept?

        this.sidebar = false;
    }

    @ViewChild(BasicSummaryProvider.TEMPLATE_NAME, { static: true }) 
    defaultSummaryTemplate:TemplateRef<any>;
    
    @ViewChild(ValueSetSummaryProvider.TEMPLATE_NAME, { static: true }) 
    valueSetTemplate:TemplateRef<any>;

    @Input()
    sidebar: boolean;

    @Input()
    set concept(concept: Concept) {
        this._concept = concept;

        this.getPerspective(this.concept).subscribe(
            perspective => { 
                console.log("got perspective");
                this.perspective = perspective;

                this.getSummaryProvider(this.perspective.root).subscribe(
                    summaryProvider => {console.log("got it ", summaryProvider.templateName); this.summaryProvider = summaryProvider }
                );
            }
        ); 
    }

    get concept() {
        return this._concept;
    }

    // getSummaryTemplate(): Observable<string> {
    //     let summaryTemplateObservable: Subject<string> = new Subject();
    //     this.summaryProvider.subscribe(
    //         summaryProvider => { console.log("got it ", summaryProvider.templateName); summaryTemplateObservable.next(summaryProvider.templateName) }
    //     )
        
    //     return summaryTemplateObservable;
    // }

    getSummaryProvider(perspectiveRootIri: string): Observable<ConceptSummaryProvider> {
        console.log("getting summary provider");
        
        let summaryProviderObservable: ReplaySubject<ConceptSummaryProvider> = new ReplaySubject();
        let summaryProvider: ConceptSummaryProvider = this.defaultSummaryProvider;
        
        const potentialSummaryProvider = this.summaryProviders.get(perspectiveRootIri);
        if(potentialSummaryProvider != null) {
            potentialSummaryProvider.canSummarise(this.concept).subscribe(
                canSummarise => { 
                    if(canSummarise) {
                        summaryProvider = potentialSummaryProvider;    
                    }
                    summaryProvider.concept = this.concept;
                    summaryProviderObservable.next(summaryProvider);
                }
            );
        }
        else {
            this.log.debug("warning - no concept summary provider registered against IRI " + perspectiveRootIri + ". Returning default provider.");
            console.log("no match for ", this.perspective.root);

            summaryProvider.concept = this.concept;
            summaryProviderObservable.next(summaryProvider);     
        }

        return summaryProviderObservable;
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