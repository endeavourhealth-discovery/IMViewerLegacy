import { ConceptService } from "./concept.service";
import { Perspectives } from './perspective.service';
import { DataModelService } from './datamodel.service';
import { LoggerService } from './logger.service';

let dataModelServiceFactory = (conceptService: ConceptService, perspectiveService: Perspectives, log: LoggerService,) => {
    return new DataModelService(conceptService, perspectiveService.dataModel.root, log);
}

export let dataModelServiceProvider = {
    provide: DataModelService,
    useFactory: dataModelServiceFactory,
    deps: [ConceptService, Perspectives, LoggerService]
};