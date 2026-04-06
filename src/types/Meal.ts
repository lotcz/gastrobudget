import {EntityBase, EntityWithName} from "zavadil-ts-common";

export type MealIngredient = EntityBase & {
	ingredientId: number;
	unitsPerServing: number;
}

export type Meal = EntityWithName & {
	costPerServing: number;
	ingredients: Array<MealIngredient>;
}

