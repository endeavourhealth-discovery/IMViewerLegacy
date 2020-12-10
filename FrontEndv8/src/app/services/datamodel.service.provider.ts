import { ConceptService } from "./concept.service";
import { Perspectives } from './perspective.service';
import { DataModelService } from './datamodel.service';

let dataModelServiceFactory = (conceptService: ConceptService, perspectiveService: Perspectives) => {
    return new DataModelService(conceptService, perspectiveService.dataModel.root);
}

export let dataModelServiceProvider = {
    provide: DataModelService,
    useFactory: dataModelServiceFactory,
    deps: [ConceptService, Perspectives]
};