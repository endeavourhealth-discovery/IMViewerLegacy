import { ConceptService } from "./concept.service";
import { Perspectives } from './perspective.service';
import { ValueSetService } from './valueset.service';
import { LoggerService } from './logger.service';

let valueSetServiceFactory = (conceptService: ConceptService, perspectiveService: Perspectives, log: LoggerService) => {
    return new ValueSetService(conceptService, perspectiveService.valueSets.root, log);
}

export let valueSetServiceProvider = {
    provide: ValueSetService,
    useFactory: valueSetServiceFactory,
    deps: [ConceptService, Perspectives, LoggerService]
};