import { Concept } from '../models/objectmodel/Concept';
import { ConceptReferenceNode } from '../models/objectmodel/ConceptReferenceNode';
import { ConceptService, ConceptAggregate } from '../services/concept.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Perspectives } from '../services/perspective.service';
import { LoggerService } from '../services/logger.service';
import {Perspective} from '../models/Perspective';
import { Subject } from 'rxjs';

export interface HistoryItem {
    url: string;
    concept: Concept;
}

export class ConceptViewState {

    history: Subject<Array<HistoryItem>>;
    conceptAggregate: Subject<ConceptAggregate>;

    private _history: Array<HistoryItem>;
    private _conceptAggregate: ConceptAggregate;

    constructor() {
        this.history = new Subject();
        this.conceptAggregate = new Subject();
    }

    public addHistoryItem(url: string) {
        if(this._conceptAggregate != undefined && this._conceptAggregate.concept != null) {
            this._history.unshift({url: url, concept: this._conceptAggregate.concept});
            this.history.next(this._history);
        }
    }

    public setConceptAggregate(conceptAggregate: ConceptAggregate) {
        this.conceptAggregate.next(conceptAggregate);
    }

    public contains(iri: string): boolean {
        let contains: boolean = false;
        if (this._conceptAggregate != null) {
            contains = this._conceptAggregate.concept.iri == iri;;
        }

        return contains;
    }
}

export class ConceptView {

    state: ConceptViewState;

    constructor(private conceptService: ConceptService,
                private perspectiveService: Perspectives,
                private log: LoggerService,
                private router: Router,
                private route: ActivatedRoute,
                private perspective: Perspective) {
        this.state = new ConceptViewState();

        this.perspectiveService.current = this.perspective;
    }

    // must be called from ngOnInit
    public init(): void {
        this.trackNavigationStart();
        this.trackNavigationEnd();
    }

    public onNavigationStart(successHandler: (conceptAggregate: ConceptAggregate) => void, errorHandler: (error: any) => void) {
        this.state.conceptAggregate.subscribe(
            (conceptAggregate: ConceptAggregate) => successHandler(conceptAggregate),
            error => errorHandler(error)
        )
    }

    public onNavigationEnd(successHandler: (history: Array<HistoryItem>) => void, errorHandler: (error: any) => void) {
        this.state.history.subscribe(
            (history: Array<HistoryItem>) => successHandler(history),
            error => errorHandler(error)
        )
    }

    private trackNavigationStart() {
        this.route.paramMap.subscribe(
            (params) => this.updateConceptAggregate(params.get('id') ? params.get('id') : this.perspective.root),
            (error) => this.log.error(error)
          );
    }

    private trackNavigationEnd() {
        this.router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                this.state.addHistoryItem(e.url);
            }
        });
    }

    private updateConceptAggregate(iri: string) {
        // no need to do anything unless this is a new IRI
        console.log("ConceptView.updateConceptAggregate iri ", iri);

        if(this.state.contains(iri) == false) {
            this.conceptService.getConceptAggregate(iri).subscribe(
                conceptAggregate => this.state.setConceptAggregate(conceptAggregate),
                error => this.log.error(error)
            );
        }
    }
}
