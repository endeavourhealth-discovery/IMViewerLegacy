import { Observable, ReplaySubject, Subject } from "rxjs";
import { ConceptService } from "src/app/services/concept.service";
import { LoggerService } from "src/app/services/logger.service";
import { ConceptReferenceNode } from "../objectmodel/ConceptReferenceNode";

export class CodeSchemes {
    public defaultCodeSchemes: Observable<ConceptReferenceNode[]>;
    
    constructor(public codeSchemes: Observable<ConceptReferenceNode[]>, private defaultCodeSchemeNames: string[]) {
        this.defaultCodeSchemes = new ReplaySubject();
        
        codeSchemes.subscribe(
            (result: ConceptReferenceNode[]) => {
                const defaultCodeSchemesSubject = this.defaultCodeSchemes as Subject<ConceptReferenceNode[]>
                defaultCodeSchemesSubject.next(this.getDefaultCodeSchemes(result))
            }
        )
    }

    getDefaultCodeSchemes(codeSchemes: ConceptReferenceNode[]): ConceptReferenceNode[] {
        const defaultCodeSchemes: ConceptReferenceNode[] = codeSchemes.filter(codeScheme => {
            return this.defaultCodeSchemeNames.indexOf(codeScheme.name) >= 0;
        });

        return defaultCodeSchemes;
    }
}

let codeSchemesFactory = (conceptService: ConceptService, log: LoggerService) => {
    let codeSchemesObservable: Subject<ConceptReferenceNode[]> = new ReplaySubject();
    const codeSchemes: CodeSchemes = new CodeSchemes(codeSchemesObservable, ["Snomed-CT code", "Discovery code", ""]);


    conceptService.getConceptChildren(':551000252107').subscribe(
        (results) => { 
            codeSchemesObservable.next(results);
        },
        (error) => {
            log.error(`Error - unable to retrieve code schemes defined under :551000252107. Cause ${error}.`);
        }
    );
      
    return codeSchemes;
}

export let codeSchemesProvider = {
    provide: CodeSchemes,
    useFactory: codeSchemesFactory,
    deps: [ConceptService, LoggerService]
};