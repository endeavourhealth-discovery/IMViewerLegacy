import { ObjectMapTypeEnum } from "./ObjectMapTypeEnum";

export interface PredicateObjectMap {
    id: number;
    property: string;
    type: ObjectMapTypeEnum;
    value: string;
}