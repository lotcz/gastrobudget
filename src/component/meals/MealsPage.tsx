import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {useCallback, useEffect, useState} from "react";
import {Button, Spinner, Stack, Table} from "react-bootstrap";
import {Meal} from "../../types/Meal";
import {useNavigate} from "react-router";
import {NumberUtil} from "zavadil-ts-common";

export default function MealsPage() {
	const navigate = useNavigate();
	const storage = useGastroStorage();
	const [meals, setMeals] = useState<Array<Meal>>();

	const reload = useCallback(
		() => {
			storage.meals.loadAll().then(setMeals);
		},
		[storage]
	);

	useEffect(reload, []);

	const addNew = useCallback(
		() => {
			navigate('/meals/add');
		},
		[]
	);

	const edit = useCallback(
		(meal: Meal) => {
			navigate(`/meals/${meal.id}`);
		},
		[]
	);

	if (!meals) return <Spinner/>

	return <div>
		<Stack direction="horizontal" gap={2}>
			{
				<Button onClick={addNew}>+ Přidat</Button>
			}
		</Stack>
		<Table striped hover>
			<thead>
			<tr>
				<th>Název</th>
				<th>Náklady na porci</th>
			</tr>
			</thead>
			<tbody>
			{
				meals.map(
					(meal, index) =>
						<tr
							key={index}
							onClick={() => edit(meal)}
							className="cursor-pointer"
						>
							<td>{meal.name}</td>
							<td className="money">{NumberUtil.round(meal.costPerServing, 2)} Kč</td>
						</tr>
				)
			}
			</tbody>
		</Table>
	</div>
}
