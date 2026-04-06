import {MealIngredient} from "../../types/Meal";
import IngredientSelect from "../ingredients/IngredientSelect";
import {useEffect, useState} from "react";
import {Ingredient} from "../../types/Ingredient";
import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {Button, FormControl, Stack} from "react-bootstrap";
import UnitLabel from "../units/UnitLabel";

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
		<td>
			<Button onClick={onDelete} variant="danger" size="sm">smazat</Button>
		</td>
	</tr>
}
