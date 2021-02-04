import { ConceptService } from "./concept.service";
import { Perspectives } from './perspective.service';
import { HealthRecordService } from './healthrecord.service';
import { LoggerService } from './logger.service';

let healthRecordServiceFactory = (conceptService: ConceptService, perspectiveService: Perspectives, log: LoggerService,) => {
    return new HealthRecordService(conceptService, perspectiveService.healthRecord.root, log);
}

export let healthRecordServiceProvider = {
    provide: HealthRecordService,
    useFactory: healthRecordServiceFactory,
    deps: [ConceptService, Perspectives, LoggerService]
};
