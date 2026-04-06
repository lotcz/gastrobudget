import {EntityWithName} from "zavadil-ts-common";

export type MeasureUnit = EntityWithName & {

}

export type Ingredient = EntityWithName & {
	unitId: number;
	costPerPackage: number;
	packageSize: number;
}


