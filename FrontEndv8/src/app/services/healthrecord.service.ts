import { Concept } from '../models/objectmodel/Concept';
import { ConceptReference } from '../models/objectmodel/ConceptReference';
import { ClassExpression } from '../models/objectmodel/ClassExpression';
import { ObjectPropertyValue } from '../models/objectmodel/ObjectPropertyValue';
import { DataPropertyValue } from '../models/objectmodel/DataPropertyValue';
import { ConceptService } from './concept.service';
import { LoggerService } from './logger.service';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export class HealthRecordProperty {
    name: string
    typeName: string
    typeIri: string
    cardinality: string

    constructor(public readonly iri: string) {}

    get type(): string {
        return (this.typeName != null) ? this.typeName : this.typeIri;
    }
}

export class HealthRecordService {

    private static DEFAULT_MIN_CARDINALITY: number = 0;
    private static DEFAULT_MAX_CARDINALITY: string = "*";

    private healthRecordConceptReference: ConceptReference;

    constructor(private conceptService: ConceptService, public readonly healthRecordIri: string, private log: LoggerService) {
      this.healthRecordConceptReference = new ConceptReference();
      this.healthRecordConceptReference.iri = this.healthRecordIri;
    }

    public isHealthRecord(concept: Concept): Observable<boolean> {
      let isHealthRecordObservable: Subject<boolean> = new Subject();

      this.conceptService.isA(concept.iri, this.healthRecordIri).subscribe(
        isHealthRecord => {
            isHealthRecordObservable.next(isHealthRecord);
        }
      );

      return isHealthRecordObservable;
    }

    public getHealthRecordProperties(concept: Concept): HealthRecordProperty[] {
        let healthRecordProperties: HealthRecordProperty[] = [];

        this.getIntersections(concept).forEach(intersection => {
            healthRecordProperties = healthRecordProperties.concat(this.toHealthRecordProperties(intersection));
        });

        return healthRecordProperties;
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

    private toHealthRecordProperties(intersection: ClassExpression): HealthRecordProperty[] {
        let healthRecordProperties: HealthRecordProperty[] = [];

        if(this.isCoreProperty(intersection) == false) {
            // push onto array of properties and return the array
            this.toClassExpressions(intersection).forEach(noneCoreIntersection => {
                this.addHealthRecordProperty(this.toHealthRecordProperty(noneCoreIntersection), healthRecordProperties);
            });
        }
        else {
            healthRecordProperties.concat(this.handleNestedProperties(intersection));
        }

        return healthRecordProperties;
    }

    private handleNestedProperties(intersection: ClassExpression): HealthRecordProperty[] {
        let healthRecordProperties: HealthRecordProperty[] = [];

        if(intersection.ObjectPropertyValue.Expression != null) {
            const nestedIntersections = intersection.ObjectPropertyValue.Expression.Intersection;
            if(nestedIntersections != null) {
                nestedIntersections.forEach(nestedIntersection => {
                    this.addHealthRecordProperty(this.toHealthRecordProperty(nestedIntersection), healthRecordProperties);
                })
            }
        }

        return healthRecordProperties;
    }

    private addHealthRecordProperty(healthRecordProperty: HealthRecordProperty, healthRecordProperties: HealthRecordProperty[]): void {
        if(healthRecordProperty != null) {
            healthRecordProperties.push(healthRecordProperty)
        }
        else {
           this.log.debug("warn - attempting to add null HealthRecordProperty to to HealthRecordProperty list");
        }
    }

    private toHealthRecordProperty(classExpression: ClassExpression): HealthRecordProperty {
        let healthRecordProperty: HealthRecordProperty;

        if(classExpression != null) {
            if(this.isDataProperty(classExpression)) {
                healthRecordProperty = this.toHealthRecordPropertyFromDataPropertyValue(classExpression.DataPropertyValue);
            }
            else if(this.isObjectProperty(classExpression)) {
                healthRecordProperty= this.toHealthRecordPropertyFromObjectPropertyValue(classExpression.ObjectPropertyValue);
            }
        }
        else {
            healthRecordProperty = null;
        }

        return healthRecordProperty;
    }

    private toHealthRecordPropertyFromObjectPropertyValue(objectPropertyValue: ObjectPropertyValue): HealthRecordProperty {
        let healthRecordProperty: HealthRecordProperty = new HealthRecordProperty(objectPropertyValue.Property.iri);

        healthRecordProperty.typeIri = objectPropertyValue.ValueType.iri
        healthRecordProperty.typeName = objectPropertyValue.ValueType.name
        healthRecordProperty.name = objectPropertyValue.Property.name
        healthRecordProperty.cardinality = this.getCardinality(objectPropertyValue.Min, objectPropertyValue.Max);

        return healthRecordProperty;
    }

    private toHealthRecordPropertyFromDataPropertyValue(dataPropertyValue: DataPropertyValue): HealthRecordProperty {
        let healthRecordProperty: HealthRecordProperty = new HealthRecordProperty(dataPropertyValue.Property.iri);

        healthRecordProperty.typeIri = dataPropertyValue.DataType.iri
        healthRecordProperty.typeName = dataPropertyValue.DataType.name
        healthRecordProperty.name = dataPropertyValue.Property.name
        healthRecordProperty.cardinality = this.getCardinality(dataPropertyValue.Min, dataPropertyValue.Max);

        return healthRecordProperty;
    }

    private getCardinality(min: number, max: any): string {

        if(min == null) {
            min = HealthRecordService.DEFAULT_MIN_CARDINALITY;
        }
        if(max == null) {
            max = HealthRecordService.DEFAULT_MAX_CARDINALITY;
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
