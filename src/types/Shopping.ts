import {Ingredient} from "./Ingredient";

export type ShoppingIngredient = {
	ingredient: Ingredient;
	requiredUnits: number;
	requiredPackages: number;
	cost: number;
}


