import {Concept} from './Concept';
import {Related} from './Related';
import {Property} from './Property';
import {zip, Observable, Subject} from 'rxjs';

export class DataModelDefinition {
  
    public concept: Concept;
    public definition: Related[];
    public properties: Property[];
    public directChildren: Related[];
    public directParents: Related[];

    constructor(concept: Concept, 
                definition: Related[], 
                properties: Property[],
                directChildren: Related[], 
                directParents: Related[]) {
        this.concept = concept;
        this.definition = definition;
        this.properties = properties;
        this.directChildren = directChildren;
        this.directParents = directParents;
    }

    hasDirectChildren(): boolean {
        return this.directChildren && this.directChildren.length > 0;
    }

    hasDirectParents(): boolean {
        return this.directParents && this.directParents.length > 0;
    }
}