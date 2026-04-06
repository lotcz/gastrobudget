import {EntityBase, EntityWithName} from "zavadil-ts-common";

export type EventMeal = EntityBase & {
	mealId: number;
	servings: number;
	sellingPrice: number;
}

export type FixedCost = {
	name: string;
	unitId: number;
	costPerUnit: number;
	units: number;
}

export type GastroEvent = EntityWithName & {
	totalShoppingCost: number;
	totalFixedCost: number;
	totalCost: number;
	totalRevenue: number;
	totalProfit: number;
	meals: Array<EventMeal>;
	fixedCosts: Array<FixedCost>;
}
