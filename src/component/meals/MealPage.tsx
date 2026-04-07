import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {useCallback, useEffect, useState} from "react";
import {Button, Form, Spinner, Stack} from "react-bootstrap";
import {FormRowControl} from "zavadil-react-common";
import {useNavigate, useParams} from "react-router";
import {Meal} from "../../types/Meal";
import MealIngredientControl from "./MealIngredientControl";
import {NumberUtil} from "zavadil-ts-common";

export default function MealPage() {
	const {id} = useParams();
	const navigate = useNavigate();
	const storage = useGastroStorage();
	const [editing, setEditing] = useState<Meal>();
	const [ingredientsExists, setIngredientsExists] = useState<boolean>(false);
	const [changed, setChanged] = useState<boolean>(false);

	const onEdit = useCallback(
		() => {
			if (editing) {
				setEditing({...editing});
				setChanged(true);
			}
		},
		[editing]
	);

	const calculateCost = useCallback(
		() => {
			if (!editing) return;
			Promise.all(
				editing.ingredients.map(
					(mi) => storage.ingredients.loadById(mi.ingredientId)
						.then((ingredient) => mi.unitsPerServing * (ingredient.costPerPackage / ingredient.packageSize))
				)
			).then(
				(costs) => {
					const cost = costs.reduce((prev, cost) => prev + cost, 0);
					if (cost !== editing.costPerServing) {
						editing.costPerServing = cost;
						onEdit();
					}
				}
			);
		},
		[storage, editing]
	);

	useEffect(calculateCost, [editing]);

	useEffect(
		() => {
			storage.ingredients.total().then((total) => setIngredientsExists(total > 0));

			if (!editing) {
				if (id) {
					storage.meals.loadById(Number(id)).then(setEditing);
				} else {
					setEditing(
						{
							name: '',
							costPerServing: 0,
							ingredients: []
						}
					);
				}
			}
		},
		[]
	);

	const save = useCallback(
		() => {
			if (editing) storage.meals.save(editing).then(() => navigate('/meals'));
		},
		[storage, editing]
	);

	if (!editing) return <Spinner/>

	return <Stack gap={2}>
		<Form onSubmit={save}>
			<FormRowControl
				label="Název"
				type="text"
				value={editing.name}
				onChange={
					(e) => {
						editing.name = e.target.value;
						onEdit();
					}
				}
			/>
		</Form>
		<h2>Přísady</h2>
		<div>Na jednu porci.</div>

		{
			editing.ingredients.length > 0 &&
			<table>
				<thead>
				<tr>
					<th>Přísada</th>
					<th>Množství</th>
					<th>Náklady</th>
					<th></th>
				</tr>
				</thead>
				<tbody>
				{
					editing.ingredients.map(
						(mi, index) => <MealIngredientControl
							key={index}
							mealIngredient={mi}
							onChange={
								(data) => {
									editing.ingredients = editing.ingredients.map((m) => m === mi ? data : m);
									onEdit();
								}
							}
							onDelete={
								() => {
									editing.ingredients = editing.ingredients.filter((m) => m !== mi);
									onEdit();
								}
							}
						/>
					)
				}
				</tbody>
			</table>
		}
		<Stack direction="horizontal" gap={2}>
			<Button
				disabled={!ingredientsExists}
				onClick={
					() => {
						storage.ingredients.loadFirst().then(
							(ingredient) => {
								editing.ingredients.push({ingredientId: Number(ingredient.id), unitsPerServing: 1});
								onEdit();
							}
						);
					}
				}
			>+ Přidat</Button>
		</Stack>
		<div>
			Náklady na porci: <strong>{NumberUtil.round(editing.costPerServing, 2)} Kč</strong>
		</div>
		<Button onClick={save} size="lg" disabled={!changed}>Uložit</Button>
	</Stack>
}
