import {useEffect, useState} from "react";
import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {MeasureUnit} from "../../types/Ingredient";

export type UnitLabelProps = {
	unitId?: number | null;
}

export default function UnitLabel({unitId}: UnitLabelProps) {
	const storage = useGastroStorage();
	const [unit, setUnit] = useState<MeasureUnit>();

	useEffect(
		() => {
			if (unitId) storage.units.loadById(unitId).then(setUnit);
		},
		[unitId]
	);

	return <span>{unit?.name}</span>

}
