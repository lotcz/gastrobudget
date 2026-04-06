import {useEffect, useState} from "react";
import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {Button, FormControl, Stack} from "react-bootstrap";
import {EventMeal} from "../../types/Event";
import {Meal} from "../../types/Meal";
import MealSelect from "../meals/MealSelect";
import {NumberUtil} from "zavadil-ts-common";

export type EventMealControlProps = {
	eventMeal: EventMeal;
	onChange: (eventMeal: EventMeal) => any;
	onDelete: () => any;
}

export default function EventMealControl({eventMeal, onChange, onDelete}: EventMealControlProps) {
	const storage = useGastroStorage();
	const [meal, setMeal] = useState<Meal>();

	useEffect(
		() => {
			if (NumberUtil.notEmpty(eventMeal.mealId) && meal?.id !== eventMeal.mealId) {
				storage.meals.loadById(eventMeal.mealId).then(setMeal);
			}
		},
		[eventMeal]
	);

	return <tr>
		<td>
			<MealSelect
				meal={meal}
				onChange={
					(m) => {
						eventMeal.mealId = Number(m?.id);
						setMeal(m || undefined);
						onChange({...eventMeal});
					}
				}
			/>
		</td>
		<td>
			<FormControl
				type="number"
				value={eventMeal.servings}
				onChange={
					(e) => {
						eventMeal.servings = Number(e.target.value);
						onChange({...eventMeal});
					}
				}
			/>
		</td>
		<td className="money">{meal ? NumberUtil.round(meal.costPerServing, 2) : 0} Kč</td>
		<td>
			<Stack direction="horizontal" gap={2}>
				<FormControl
					type="number"
					value={eventMeal.sellingPrice}
					onChange={
						(e) => {
							eventMeal.sellingPrice = Number(e.target.value);
							onChange({...eventMeal});
						}
					}
				/>
				<div>Kč</div>
			</Stack>
		</td>
		<td className="money">{NumberUtil.round(eventMeal.sellingPrice - (meal ? meal.costPerServing : 0), 2)} Kč</td>
		<td className="money">{NumberUtil.round((1 - (meal ? meal.costPerServing : 0) / eventMeal.sellingPrice) * 100, 0)} %</td>
		<td className="money">{NumberUtil.round(eventMeal.servings * (eventMeal.sellingPrice - (meal ? meal.costPerServing : 0)), 0)} Kč</td>
		<td>
			<Button onClick={onDelete} variant="danger" size="sm">smazat</Button>
		</td>
	</tr>
}
