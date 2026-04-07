import {MealIngredient} from "../../types/Meal";
import IngredientSelect from "../ingredients/IngredientSelect";
import {useEffect, useMemo, useState} from "react";
import {Ingredient} from "../../types/Ingredient";
import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {Button, FormControl, Stack} from "react-bootstrap";
import UnitLabel from "../units/UnitLabel";
import {NumberUtil} from "zavadil-ts-common";

export type MealIngredientProps = {
	mealIngredient: MealIngredient;
	onChange: (mealIngredient: MealIngredient) => any;
	onDelete: () => any;
}

export default function MealIngredientControl({mealIngredient, onChange, onDelete}: MealIngredientProps) {
	const storage = useGastroStorage();
	const [ingredient, setIngredient] = useState<Ingredient>();

	useEffect(
		() => {
			if (mealIngredient.ingredientId && ingredient?.id !== mealIngredient.ingredientId)
				storage.ingredients.loadById(mealIngredient.ingredientId).then(setIngredient);
		},
		[mealIngredient]
	);

	const ingredientCost = useMemo(
		() => {
			if (!ingredient) return 0;
			return (ingredient.costPerPackage / ingredient.packageSize) * mealIngredient.unitsPerServing;
		},
		[ingredient, mealIngredient]
	);

	return <tr>
		<td>
			<IngredientSelect
				ingredient={ingredient}
				onChange={
					(i) => {
						mealIngredient.ingredientId = Number(i?.id);
						onChange({...mealIngredient});
					}
				}
			/>
		</td>
		<td>
			<Stack direction="horizontal" gap={2}>
				<FormControl
					type="number"
					value={mealIngredient.unitsPerServing}
					onChange={
						(e) => {
							mealIngredient.unitsPerServing = Number(e.target.value);
							onChange({...mealIngredient});
						}
					}
				/>
				<UnitLabel unitId={ingredient?.unitId}/>
			</Stack>
		</td>
		<td className="money">
			{NumberUtil.round(ingredientCost, 2)} Kč
		</td>
		<td>
			<Button onClick={onDelete} variant="danger" size="sm">smazat</Button>
		</td>
	</tr>
}
