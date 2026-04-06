import {useEffect, useMemo, useState} from "react";
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

	const costPerServing = useMemo(
		() => NumberUtil.round(meal ? meal.costPerServing : 0, 2),
		[meal]
	);

	const profitPerServing = useMemo(
		() => NumberUtil.round(eventMeal.sellingPrice - costPerServing, 2),
		[eventMeal, costPerServing]
	);

	const profitabilityPerServing = useMemo(
		() => {
			if (eventMeal.sellingPrice === 0) return 0;
			return NumberUtil.round(profitPerServing / eventMeal.sellingPrice, 2) * 100
		},
		[eventMeal, profitPerServing]
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
		<td className="money">{profitPerServing} Kč</td>
		<td className="money">{profitabilityPerServing} %</td>
		<td className="money">{NumberUtil.round(eventMeal.servings * profitPerServing)} Kč</td>
		<td>
			<Button onClick={onDelete} variant="danger" size="sm">smazat</Button>
		</td>
	</tr>
}
