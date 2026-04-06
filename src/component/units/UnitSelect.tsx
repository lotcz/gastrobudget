import {EntityWithNameIdSelect} from "zavadil-react-common";
import {useEffect, useState} from "react";
import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {MeasureUnit} from "../../types/Ingredient";

export type UnitSelectProps = {
	unitId?: number | null;
	onChange: (unitId?: number | null) => any;
}

export default function UnitSelect({unitId, onChange}: UnitSelectProps) {
	const storage = useGastroStorage();
	const [units, setUnits] = useState<Array<MeasureUnit>>();

	useEffect(
		() => {
			storage.units.loadAll().then(setUnits);
		},
		[storage]
	);

	return <EntityWithNameIdSelect
		options={units}
		id={unitId}
		onChange={onChange}
	/>

}
