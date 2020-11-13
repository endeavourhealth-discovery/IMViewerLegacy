import { Clazz } from './../objectmodel/Clazz';
import {Related} from './Related';
import {Property} from './Property';
import {zip, Observable, Subject} from 'rxjs';

export class DataModelDefinition {

    public concept: Clazz;
    public definition: Related[];
    public properties: Property[];
    public directChildren: Related[];
    public directParents: Related[];

    constructor(concept: Clazz,
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

    hasProperties(): boolean {
        return this.properties && this.properties.length > 0;
    }

    getDirectParentConcepts(): Clazz[] {
        // TODO - maybe filter out non-datamodel parents?
        return this.getConcepts(this.directParents);
    }

    getDirectChildConcepts(): Clazz[] {
        return this.getConcepts(this.directChildren);
    }

    getFlatProperties(): FlatProperty[] {
        let flatProperies: FlatProperty[] = [];

        if(this.hasProperties()) {
            flatProperies = this.properties.map((property: Property) => {
                const dataModelProperty: FlatProperty =  {
                  name: property.property.name,
                  description: property.property.description,
                  iri: property.property.iri,
                  type: property.valueType.name,
                  cardinality: `${property.minCardinality} .. ${property.maxCardinality}`,
                  declaredOn:  this.getDeclaredOn(property),
                  source: property
                };

                return dataModelProperty;
              })
        }

        return flatProperies;
    }

    private getDeclaredOn(property: Property): Clazz {
        let declaredOn: Clazz = this.concept;

        if(property.owner.iri != this.concept.iri) {
            declaredOn = property.owner;
        }

        return declaredOn;
    }

    private getConcepts(relateds: Related[]): Clazz[] {
        let concepts: Clazz[] = [];

        if(relateds && relateds.length > 0) {
            concepts = relateds.map((related: Related) => {
                return related.concept;
            });
        }

        return concepts;
    }
}

export interface FlatProperty {
    name: string;
    description: string;
    iri: string;
    cardinality: string;
    type: string; // could be an enum
    source: Property; // the original source of the FlatProperty
    declaredOn?: Clazz;
  }
