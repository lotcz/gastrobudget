import {Button, FormControl, Stack} from "react-bootstrap";
import {FixedCost} from "../../types/Event";
import UnitSelect from "../units/UnitSelect";
import {NumberUtil} from "zavadil-ts-common";

export type EventFixedCostControlProps = {
	fixedCost: FixedCost;
	onChange: (fixedCost: FixedCost) => any;
	onDelete: () => any;
}

export default function EventFixedCostControl({fixedCost, onChange, onDelete}: EventFixedCostControlProps) {

	return <tr>
		<td>
			<FormControl
				type="text"
				value={fixedCost.name}
				onChange={
					(e) => {
						fixedCost.name = e.target.value;
						onChange({...fixedCost});
					}
				}
			/>
		</td>
		<td>
			<FormControl
				type="number"
				value={fixedCost.units}
				onChange={
					(e) => {
						fixedCost.units = Number(e.target.value);
						onChange({...fixedCost});
					}
				}
			/>
		</td>
		<td>
			<UnitSelect
				unitId={fixedCost.unitId}
				onChange={
					(unitId) => {
						fixedCost.unitId = Number(unitId);
						onChange({...fixedCost});
					}
				}
			/>
		</td>
		<td>
			<Stack direction="horizontal">
				<FormControl
					type="number"
					value={fixedCost.costPerUnit}
					onChange={
						(e) => {
							fixedCost.costPerUnit = Number(e.target.value);
							onChange({...fixedCost});
						}
					}
				/>
				<div>Kč</div>
			</Stack>
		</td>
		<td className="money">
			{NumberUtil.round(fixedCost.costPerUnit * fixedCost.units)} Kč
		</td>
		<td>
			<Button onClick={onDelete} variant="danger" size="sm">smazat</Button>
		</td>
	</tr>
}
