import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {useCallback, useState} from "react";
import {Ingredient} from "../../types/Ingredient";
import {Button, Form, Stack} from "react-bootstrap";
import {FormRow, FormRowControl} from "zavadil-react-common";
import UnitSelect from "../units/UnitSelect";

export type IngredientDetailProps = {
	ingredient: Ingredient;
	onSaved: (ingredient: Ingredient) => any;
}

export default function IngredientDetail({ingredient, onSaved}: IngredientDetailProps) {
	const storage = useGastroStorage();
	const [editing, setEditing] = useState<Ingredient>({...ingredient});
	const [changed, setChanged] = useState<boolean>(false);

	const save = useCallback(
		() => {
			storage.ingredients.save(editing).then(onSaved);
		},
		[storage, editing, onSaved]
	);

	const onEdit = useCallback(
		() => {
			setEditing({...editing});
			setChanged(true);
		},
		[editing]
	);

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
			<FormRow label="Jednotka">
				<UnitSelect
					unitId={editing.unitId}
					onChange={
						(e) => {
							editing.unitId = Number(e);
							onEdit();
						}
					}
				/>
			</FormRow>
			<FormRowControl
				label="Množství v balení"
				type="number"
				value={editing.packageSize}
				onChange={
					(e) => {
						editing.packageSize = Number(e.target.value);
						onEdit();
					}
				}
			/>
			<FormRowControl
				label="Cena balení"
				type="number"
				value={editing.costPerPackage}
				onChange={
					(e) => {
						editing.costPerPackage = Number(e.target.value);
						onEdit();
					}
				}
			/>
		</Form>
		<Button onClick={save} disabled={!changed}>Uložit</Button>
	</Stack>
}
