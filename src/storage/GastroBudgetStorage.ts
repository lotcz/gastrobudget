import {GenericStorage} from "./GenericStorage";
import {Ingredient, MeasureUnit} from "../types/Ingredient";
import {Meal} from "../types/Meal";
import {GastroEvent} from "../types/Event";
import {LocalStorage} from "./LocalStorage";
import {createContext, useContext} from "react";
import {GenericStorageWithSearch} from "./GenericStorageWithSearch";
import {LocalStorageWithSearch} from "./LocalStorageWithSearch";

export interface GastroBudgetStorage {

	units: GenericStorage<MeasureUnit>;

	ingredients: GenericStorageWithSearch<Ingredient>;

	meals: GenericStorageWithSearch<Meal>;

	events: GenericStorageWithSearch<GastroEvent>;
}

export class GastroBudgetLocalStorage implements GastroBudgetStorage {

	units: LocalStorage<MeasureUnit>;

	ingredients: LocalStorageWithSearch<Ingredient>;

	meals: LocalStorageWithSearch<Meal>;

	events: LocalStorageWithSearch<GastroEvent>;

	constructor() {
		this.units = new LocalStorage<MeasureUnit>('unit');
		this.ingredients = new LocalStorageWithSearch<Ingredient>('ingredient');
		this.meals = new LocalStorageWithSearch<Meal>('meal');
		this.events = new LocalStorageWithSearch<GastroEvent>('event');

		this.units.loadAll().then(
			(allUnits) => {
				if (allUnits.length === 0) {
					console.log('Initializing units');
					this.units.save({name: "ks"});
					this.units.save({name: "ml"});
					this.units.save({name: "g"});
				}
			}
		);
	}

}

export const GastroStorageContext = createContext<GastroBudgetStorage>(new GastroBudgetLocalStorage());

export function useGastroStorage(): GastroBudgetStorage {
	return useContext(GastroStorageContext);
}
