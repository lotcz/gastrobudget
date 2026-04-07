import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {useCallback, useEffect, useState} from "react";
import {Ingredient} from "../../types/Ingredient";
import {Button, Spinner, Stack, Table} from "react-bootstrap";
import IngredientDetail from "./IngredientDetail";
import UnitLabel from "../units/UnitLabel";

export default function IngredientsPage() {
	const storage = useGastroStorage();
	const [ingredients, setIngredients] = useState<Array<Ingredient>>();
	const [editing, setEditing] = useState<Ingredient>();
	const [inserting, setInserting] = useState<Ingredient>();

	const reload = useCallback(
		() => {
			storage.ingredients.loadAll().then(setIngredients);
		},
		[storage]
	);

	useEffect(reload, []);

	const addNew = useCallback(
		() => {
			setEditing(undefined);
			setInserting(
				{
					name: "",
					unitId: 1,
					packageSize: 1,
					costPerPackage: 100
				}
			);
		},
		[]
	);

	const edit = useCallback(
		(ingredient: Ingredient) => {
			setInserting(undefined);
			setEditing(ingredient);
		},
		[]
	);

	if (!ingredients) return <Spinner/>

	return <div>
		<Stack direction="horizontal" gap={2}>
			{
				(!inserting) && <Button onClick={addNew}>+ Přidat</Button>
			}
		</Stack>
		{
			inserting && <IngredientDetail
				ingredient={inserting}
				onSaved={
					() => {
						setInserting(undefined);
						reload();
					}
				}
			/>
		}
		<Table striped hover>
			<thead>
			<tr>
				<th>Název</th>
				<th>Velikost balení</th>
				<th>Cena balení</th>
			</tr>
			</thead>
			<tbody>
			{
				ingredients.map(
					(ingredient, index) =>
						(editing === ingredient) ? <tr key={index}>
								<td colSpan={4}>
									<div className="border border-1 border-primary p-2">
										<IngredientDetail
											ingredient={editing}
											onSaved={
												() => {
													setEditing(undefined);
													reload();
												}
											}
										/>
									</div>
								</td>
							</tr>
							:
							<tr
								key={index}
								onClick={() => edit(ingredient)}
								className="cursor-pointer"
							>
								<td>{ingredient.name}</td>
								<td>{ingredient.packageSize} <UnitLabel unitId={ingredient.unitId}/></td>
								<td className="money">{ingredient.costPerPackage} Kč</td>
							</tr>
				)
			}
			</tbody>
		</Table>
	</div>;
}
