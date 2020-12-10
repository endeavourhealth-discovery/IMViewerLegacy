import { ConceptService } from "./concept.service";
import { Perspectives } from './perspective.service';
import { ValueSetService } from './valueset.service';

let valueSetServiceFactory = (conceptService: ConceptService, perspectiveService: Perspectives) => {
    return new ValueSetService(conceptService, perspectiveService.valueSets.root);
}

export let valueSetServiceProvider = {
    provide: ValueSetService,
    useFactory: valueSetServiceFactory,
    deps: [ConceptService, Perspectives]
};