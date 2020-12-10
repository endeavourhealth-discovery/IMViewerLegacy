import { Concept } from '../models/objectmodel/Concept';
import { ConceptReference } from '../models/objectmodel/ConceptReference';
import { ConceptType } from '../models/objectmodel/ConceptType';
import { ClassExpression } from '../models/objectmodel/ClassExpression';
import { ObjectPropertyValue } from '../models/objectmodel/ObjectPropertyValue';
import { DataPropertyValue } from '../models/objectmodel/DataPropertyValue';
import { ConceptService } from './concept.service';
import {Injectable} from '@angular/core';
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

    constructor(private conceptService: ConceptService, public readonly dataModelIri: string) {
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

        console.log(`data model service - data model properties ${JSON.stringify(dataModelProperties)}`);


        // if (concept.SubClassOf[0].Intersection != null) {
        //     concept.SubClassOf[0].Intersection.forEach(intersection => {
        //       if (intersection.ObjectPropertyValue != null && intersection.ObjectPropertyValue.Property.iri !== ':hasCoreProperties') {
        //         this.hoveredDataModelTableData.push(intersection);
        //       }
        //       if (intersection.ObjectPropertyValue != null && intersection.ObjectPropertyValue.Expression != null && intersection.ObjectPropertyValue.Expression.Intersection != null && intersection.ObjectPropertyValue.Property.iri === ':hasCoreProperties') {
        //         intersection.ObjectPropertyValue.Expression.Intersection.forEach(subIntersection => {
        //           this.hoveredDataModelTableData.push(subIntersection);
        //         });
        //       }
        //     }); 
        //   }        

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

        console.log(JSON.stringify(dataModelProperties));
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
        
        // if (intersection.ObjectPropertyValue != null && intersection.ObjectPropertyValue.Expression != null && intersection.ObjectPropertyValue.Expression.Intersection != null && intersection.ObjectPropertyValue.Property.iri === ':hasCoreProperties') {
        //     intersection.ObjectPropertyValue.Expression.Intersection.forEach(subIntersection => {
        //       this.hoveredDataModelTableData.push(subIntersection);
        //     });
        //   }
    }

    private addDataModelProperty(dataModelProperty: DataModelProperty, dataModelProperties: DataModelProperty[]): void {
        if(dataModelProperty != null) {
            dataModelProperties.push(dataModelProperty)
        }
        else {
           console.log("warn - attempting to add null DataModelProperty to to DataModelProperty list");
        }
    }

    private toDataModelProperty(classExpression: ClassExpression): DataModelProperty {
        let dataModelProperty: DataModelProperty;
        
        if(this.isDataProperty(classExpression)) {
            dataModelProperty = this.toDataModelPropertyFromDataPropertyValue(classExpression.DataPropertyValue);
        }
        else if(this.isObjectProperty(classExpression)) {
            dataModelProperty= this.toDataModelPropertyFromObjectPropertyValue(classExpression.ObjectPropertyValue);
        }
        else {
            console.log(`warn - uanble to convert ClassExpression (${JSON.stringify(classExpression)}) to a DataModelProperty instance.`);
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