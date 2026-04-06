import {useEffect, useState} from "react";
import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {Meal} from "../../types/Meal";

export type MealLabelProps = {
	mealId?: number | null;
}

export default function MealLabel({mealId}: MealLabelProps) {
	const storage = useGastroStorage();
	const [meal, setMeal] = useState<Meal>();

	useEffect(
		() => {
			if (mealId) storage.meals.loadById(mealId).then(setMeal);
		},
		[mealId]
	);

	return <span>{meal?.name}</span>

}
