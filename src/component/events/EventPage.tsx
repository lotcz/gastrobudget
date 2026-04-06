import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {useCallback, useEffect, useState} from "react";
import {Button, Form, Spinner, Stack, Table} from "react-bootstrap";
import {FormRowControl} from "zavadil-react-common";
import {useNavigate, useParams} from "react-router";
import {NumberUtil} from "zavadil-ts-common";
import {GastroEvent} from "../../types/Event";
import EventMealControl from "./EventMealControl";
import {ShoppingIngredient} from "../../types/Shopping";
import {Ingredient} from "../../types/Ingredient";
import UnitLabel from "../units/UnitLabel";
import MealLabel from "../meals/MealLabel";
import EventFixedCostControl from "./EventFixedCostControl";

export default function EventPage() {
	const {id} = useParams();
	const navigate = useNavigate();
	const storage = useGastroStorage();
	const [editing, setEditing] = useState<GastroEvent>();
	const [mealsExists, setMealsExists] = useState<boolean>(false);
	const [changed, setChanged] = useState<boolean>(false);
	const [shoppingIngredients, setShoppingIngredients] = useState<Array<ShoppingIngredient>>([]);

	const onEdit = useCallback(
		() => {
			if (editing) {
				setEditing({...editing});
				setChanged(true);
			}
		},
		[editing]
	);

	const calculateIngredients = useCallback(
		() => {
			if (!editing) return;
			Promise.all(
				editing.meals
					.filter((m) => NumberUtil.notEmpty(m.mealId))
					.map(
						(em) => storage.meals.loadById(em.mealId)
							.then(
								(meal) => Promise.all(
									meal.ingredients.map(
										(mi) => storage.ingredients.loadById(mi.ingredientId)
											.then(
												(i: Ingredient): ShoppingIngredient => {
													return {
														ingredient: i,
														requiredUnits: mi.unitsPerServing * em.servings,
														requiredPackages: 0,
														cost: 0
													}
												}
											)
									)
								)
							)
					)
			).then(
				(allIngredients: ShoppingIngredient[][]) => {
					if (allIngredients.length === 0) {
						setShoppingIngredients([]);
						return;
					}
					const reduced: ShoppingIngredient[] = allIngredients[0];
					for (let i = 1, max = allIngredients.length; i < max; i++) {
						allIngredients[i].forEach(
							(shoppingIngredient) => {
								const existing = reduced.find((r) => r.ingredient.id === shoppingIngredient.ingredient.id);
								if (existing) {
									existing.requiredUnits += shoppingIngredient.requiredUnits;
								} else {
									reduced.push(shoppingIngredient);
								}
							}
						);
					}
					reduced.forEach(
						(si) => {
							si.requiredPackages = Math.ceil(si.requiredUnits / si.ingredient.packageSize);
							si.cost = si.requiredPackages * si.ingredient.costPerPackage;
						}
					);
					setShoppingIngredients(reduced);
				}
			);
		},
		[storage, editing]
	);

	useEffect(calculateIngredients, [editing]);

	// calculate shopping cost
	useEffect(
		() => {
			if (!editing) return;
			const cost = shoppingIngredients.reduce((prev, si) => prev + si.cost, 0);
			if (cost !== editing.totalShoppingCost) {
				editing.totalShoppingCost = cost;
				onEdit();
			}
		},
		[shoppingIngredients]
	);

	// calculate fixed cost
	useEffect(
		() => {
			if (!editing) return;
			if (!editing.fixedCosts) editing.fixedCosts = [];
			const cost = editing.fixedCosts.reduce((prev, fc) => prev + (fc.costPerUnit * fc.units), 0);
			if (cost !== editing.totalFixedCost) {
				editing.totalFixedCost = cost;
				onEdit();
			}
		},
		[editing]
	);

	// calculate total cost
	useEffect(
		() => {
			if (!editing) return;
			const cost = editing.totalFixedCost + editing.totalShoppingCost;
			if (cost !== editing.totalCost) {
				editing.totalCost = cost;
				onEdit();
			}
		},
		[editing]
	);

	// calculate revenue
	useEffect(
		() => {
			if (!editing) return;
			const revenue = editing.meals.reduce((prev, em) => prev + (em.sellingPrice * em.servings), 0)
			if (revenue !== editing.totalRevenue) {
				editing.totalRevenue = revenue;
				onEdit();
			}
		},
		[editing]
	);

	// calculate profit
	useEffect(
		() => {
			if (!editing) return;
			const profit = editing.totalRevenue - editing.totalCost;
			if (profit !== editing.totalProfit) {
				editing.totalProfit = profit;
				onEdit();
			}
		},
		[editing]
	);

	useEffect(
		() => {
			storage.meals.total().then((total) => setMealsExists(total > 0));

			if (!editing) {
				if (id) {
					storage.events.loadById(Number(id)).then(setEditing);
				} else {
					setEditing(
						{
							name: '',
							totalShoppingCost: 0,
							totalFixedCost: 0,
							totalCost: 0,
							totalRevenue: 0,
							totalProfit: 0,
							meals: [],
							fixedCosts: []
						}
					);
				}
			}
		},
		[]
	);

	const save = useCallback(
		() => {
			if (editing) storage.events.save(editing).then(() => navigate('/events'));
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
		<h2>Jídla</h2>
		{
			editing.meals.length > 0 &&
			<Table>
				<thead>
				<tr>
					<th>Jídlo</th>
					<th>Počet porcí</th>
					<th>Náklady na porci</th>
					<th>Prodejní cena</th>
					<th>Zisk na porci</th>
					<th>Marže</th>
					<th>Zisk</th>
					<th></th>
				</tr>
				</thead>
				<tbody>
				{
					editing.meals.map(
						(em, index) => <EventMealControl
							key={index}
							eventMeal={em}
							onChange={
								(data) => {
									editing.meals = editing.meals.map((m) => m === em ? data : m);
									onEdit();
								}
							}
							onDelete={
								() => {
									editing.meals = editing.meals.filter((m) => m !== em);
									onEdit();
								}
							}
						/>
					)
				}
				</tbody>
			</Table>
		}
		<Stack direction="horizontal" gap={2}>
			<Button
				disabled={!mealsExists}
				onClick={
					() => {
						storage.meals.loadFirst().then(
							(meal) => {
								editing.meals.push({mealId: Number(meal.id), servings: 100, sellingPrice: 100});
								onEdit();
							}
						);
					}
				}
			>+ Přidat</Button>
		</Stack>

		<h2>Příjmy</h2>

		{
			editing.meals.length > 0 &&
			<div>
				<Table>
					<thead>
					<tr>
						<th>Název</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					{
						editing.meals.map(
							(em, index) => <tr key={index}>
								<td><MealLabel mealId={em.mealId}/></td>
								<td className="money">{em.sellingPrice * em.servings} Kč</td>
							</tr>
						)
					}
					<tr>
						<td></td>
						<td className="money"><strong>{NumberUtil.round(editing.totalRevenue)} Kč</strong></td>
					</tr>
					</tbody>
				</Table>
			</div>
		}

		<h2>Výdaje</h2>

		<h2>Fixní</h2>
		{
			editing.fixedCosts.length > 0 &&
			<Table>
				<thead>
				<tr>
					<th>Název</th>
					<th>Počet</th>
					<th>Jednotka</th>
					<th>Cena za jednotku</th>
					<th>Celková cena</th>
					<th></th>
				</tr>
				</thead>
				<tbody>
				{
					editing.fixedCosts.map(
						(fc, index) => <EventFixedCostControl
							key={index}
							fixedCost={fc}
							onChange={
								(data) => {
									editing.fixedCosts = editing.fixedCosts.map((m) => m === fc ? data : m);
									onEdit();
								}
							}
							onDelete={
								() => {
									editing.fixedCosts = editing.fixedCosts.filter((m) => m !== fc);
									onEdit();
								}
							}
						/>
					)
				}
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td className="money"><strong>{NumberUtil.round(editing.totalFixedCost)} Kč</strong></td>
				</tr>
				</tbody>
			</Table>
		}

		<Stack direction="horizontal" gap={2}>
			<Button
				onClick={
					() => {
						storage.units.loadFirst().then(
							(unit) => {
								editing.fixedCosts.push({name: '', unitId: Number(unit.id), units: 1, costPerUnit: 100});
								onEdit();
							}
						);
					}
				}
			>+ Přidat</Button>
		</Stack>

		<h3>Nákup</h3>
		{
			shoppingIngredients.length > 0 &&
			<Table>
				<thead>
				<tr>
					<th>Přísada</th>
					<th>Množství</th>
					<th>Počet balení</th>
					<th>Cena balení</th>
					<th>Cena</th>
				</tr>
				</thead>
				<tbody>
				{
					shoppingIngredients.map(
						(si, index) => <tr key={index}>
							<td>{si.ingredient.name}</td>
							<td>{si.requiredUnits} <UnitLabel unitId={si.ingredient.unitId}/></td>
							<td><strong>{si.requiredPackages}</strong> x {si.ingredient.packageSize} <UnitLabel unitId={si.ingredient.unitId}/></td>
							<td className="money">{si.ingredient.costPerPackage} Kč</td>
							<td className="money">{si.cost} Kč</td>
						</tr>
					)
				}
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td className="money"><strong>{NumberUtil.round(editing.totalShoppingCost)} Kč</strong></td>
				</tr>
				</tbody>
			</Table>
		}

		<div>
			Celkové výdaje: <strong>{NumberUtil.round(editing.totalCost)} Kč</strong>
		</div>

		<h2>Zisk</h2>

		<div>
			Celkový zisk při prodeji 25% porcí: <strong>{NumberUtil.round((0.25 * editing.totalRevenue) - editing.totalCost)} Kč</strong>
		</div>
		<div>
			Celkový zisk při prodeji 50% porcí: <strong>{NumberUtil.round((0.5 * editing.totalRevenue) - editing.totalCost)} Kč</strong>
		</div>
		<div>
			Celkový zisk při prodeji 75% porcí: <strong>{NumberUtil.round((0.75 * editing.totalRevenue) - editing.totalCost)} Kč</strong>
		</div>
		<div>
			Celkový zisk při prodeji všech porcí: <strong>{NumberUtil.round(editing.totalProfit)} Kč</strong>
		</div>

		<Button onClick={save} size="lg" disabled={!changed}>Uložit</Button>
	</Stack>
}
