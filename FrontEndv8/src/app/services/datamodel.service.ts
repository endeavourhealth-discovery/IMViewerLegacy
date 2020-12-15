import { Concept } from '../models/objectmodel/Concept';
import { ConceptReference } from '../models/objectmodel/ConceptReference';
import { ClassExpression } from '../models/objectmodel/ClassExpression';
import { ObjectPropertyValue } from '../models/objectmodel/ObjectPropertyValue';
import { DataPropertyValue } from '../models/objectmodel/DataPropertyValue';
import { ConceptService } from './concept.service';
import { LoggerService } from './logger.service';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export class DataModelProperty {
    name: string
    typeName: string
    typeIri: string
    cardinality: string

    constructor(public readonly iri: string) {}

    get type(): string {
        return (this.typeName != null) ? this.typeName : this.typeIri;
    }
}

@Injectable()
export class DataModelService {

    private static DEFAULT_MIN_CARDINALITY: number = 0;
    private static DEFAULT_MAX_CARDINALITY: string = "*";

    private dataModelConceptReference: ConceptReference;

    constructor(private conceptService: ConceptService, public readonly dataModelIri: string, private log: LoggerService) {
      this.dataModelConceptReference = new ConceptReference();
      this.dataModelConceptReference.iri = this.dataModelIri;
    }

    public isDataModel(concept: Concept): Observable<boolean> {
      let isDataModelObservable: Subject<boolean> = new Subject();
      
      this.conceptService.isA(concept.iri, this.dataModelIri).subscribe(
        isDataModel => {
            isDataModelObservable.next(isDataModel);
        }
      );

      return isDataModelObservable;
    }

    public getDataModelProperties(concept: Concept): DataModelProperty[] {        
        let dataModelProperties: DataModelProperty[] = [];

        this.getIntersections(concept).forEach(intersection => {
            dataModelProperties = dataModelProperties.concat(this.toDataModelProperties(intersection));
        });
      
        return dataModelProperties;
    }

    private getIntersections(concept: Concept): ClassExpression[] {
        let intersections: ClassExpression[] = [];

        if (concept.SubClassOf[0].Intersection != null) {
            intersections.push(concept.SubClassOf[0].Intersection);
        }

        return intersections;
    }

    private isCoreProperty(classExpression: ClassExpression): boolean {
        return (classExpression.ObjectPropertyValue != null && classExpression.ObjectPropertyValue.Property.iri === ':hasCoreProperties');
    }

    private toClassExpressions(source: any): ClassExpression[] {
        let intermediate = source as unknown;

        return intermediate as Array<ClassExpression>;
    }

    private toDataModelProperties(intersection: ClassExpression): DataModelProperty[] {
        let dataModelProperties: DataModelProperty[] = [];
        
        if(this.isCoreProperty(intersection) == false) {
            // push onto array of properties and return the array
            this.toClassExpressions(intersection).forEach(noneCoreIntersection => { 
                this.addDataModelProperty(this.toDataModelProperty(noneCoreIntersection), dataModelProperties);
            });
        }
        else {
            dataModelProperties.concat(this.handleNestedProperties(intersection));
        }

        return dataModelProperties;
    }

    private handleNestedProperties(intersection: ClassExpression): DataModelProperty[] {
        let dataModelProperties: DataModelProperty[] = [];
        
        if(intersection.ObjectPropertyValue.Expression != null) {
            const nestedIntersections = intersection.ObjectPropertyValue.Expression.Intersection;
            if(nestedIntersections != null) {
                nestedIntersections.forEach(nestedIntersection => {
                    this.addDataModelProperty(this.toDataModelProperty(nestedIntersection), dataModelProperties);
                })
            }
        }

        return dataModelProperties;
    }

    private addDataModelProperty(dataModelProperty: DataModelProperty, dataModelProperties: DataModelProperty[]): void {
        if(dataModelProperty != null) {
            dataModelProperties.push(dataModelProperty)
        }
        else {
           this.log.debug("warn - attempting to add null DataModelProperty to to DataModelProperty list");
        }
    }

    private toDataModelProperty(classExpression: ClassExpression): DataModelProperty {
        let dataModelProperty: DataModelProperty;

        if(classExpression != null) {
            if(this.isDataProperty(classExpression)) {
                dataModelProperty = this.toDataModelPropertyFromDataPropertyValue(classExpression.DataPropertyValue);
            }
            else if(this.isObjectProperty(classExpression)) {
                dataModelProperty= this.toDataModelPropertyFromObjectPropertyValue(classExpression.ObjectPropertyValue);
            }
        }
        else {
            dataModelProperty = null;
        }

        return dataModelProperty;
    }

    private toDataModelPropertyFromObjectPropertyValue(objectPropertyValue: ObjectPropertyValue): DataModelProperty {
        let dataModelProperty: DataModelProperty = new DataModelProperty(objectPropertyValue.Property.iri);

        dataModelProperty.typeIri = objectPropertyValue.ValueType.iri
        dataModelProperty.typeName = objectPropertyValue.ValueType.name
        dataModelProperty.name = objectPropertyValue.Property.name
        dataModelProperty.cardinality = this.getCardinality(objectPropertyValue.Min, objectPropertyValue.Max);

        return dataModelProperty;
    }

    private toDataModelPropertyFromDataPropertyValue(dataPropertyValue: DataPropertyValue): DataModelProperty {
        let dataModelProperty: DataModelProperty = new DataModelProperty(dataPropertyValue.Property.iri);

        dataModelProperty.typeIri = dataPropertyValue.DataType.iri
        dataModelProperty.typeName = dataPropertyValue.DataType.name
        dataModelProperty.name = dataPropertyValue.Property.name
        dataModelProperty.cardinality = this.getCardinality(dataPropertyValue.Min, dataPropertyValue.Max);

        return dataModelProperty;
    }

    private getCardinality(min: number, max: any): string {

        if(min == null) {
            min = DataModelService.DEFAULT_MIN_CARDINALITY;
        }
        if(max == null) {
            max = DataModelService.DEFAULT_MAX_CARDINALITY;
        }

        return `${min}:${max}`;
    }

    private isObjectProperty(classExpression: ClassExpression): boolean {
        return classExpression.ObjectPropertyValue != null && classExpression.ObjectPropertyValue.Property.iri && classExpression.DataPropertyValue == null
    }

    private isDataProperty(classExpression: ClassExpression): boolean {
        return classExpression.DataPropertyValue != null && classExpression.DataPropertyValue.Property.iri && classExpression.ObjectPropertyValue == null
    }

}