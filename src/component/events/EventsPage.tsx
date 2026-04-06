import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {useCallback, useEffect, useState} from "react";
import {Button, Spinner, Stack, Table} from "react-bootstrap";
import {useNavigate} from "react-router";
import {GastroEvent} from "../../types/Event";
import {NumberUtil} from "zavadil-ts-common";

export default function EventsPage() {
	const navigate = useNavigate();
	const storage = useGastroStorage();
	const [events, setEvents] = useState<Array<GastroEvent>>();

	const reload = useCallback(
		() => {
			storage.events.loadAll().then(setEvents);
		},
		[storage]
	);

	useEffect(reload, []);

	const addNew = useCallback(
		() => {
			navigate('/events/add');
		},
		[]
	);

	const edit = useCallback(
		(event: GastroEvent) => {
			navigate(`/events/${event.id}`);
		},
		[]
	);

	if (!events) return <Spinner/>

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
				<th>Náklady</th>
				<th>Příjmy</th>
				<th>Zisk</th>
			</tr>
			</thead>
			<tbody>
			{
				events.map(
					(meal, index) =>
						<tr
							key={index}
							onClick={() => edit(meal)}
							className="cursor-pointer"
						>
							<td>{meal.name}</td>
							<td className="money">{NumberUtil.round(meal.totalCost)} Kč</td>
							<td className="money">{NumberUtil.round(meal.totalRevenue)} Kč</td>
							<td className="money">{NumberUtil.round(meal.totalProfit)} Kč</td>
						</tr>
				)
			}
			</tbody>
		</Table>
	</div>
}
