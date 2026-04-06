import {AutocompleteSelect} from "zavadil-react-common";
import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {Meal} from "../../types/Meal";

export type MealSelectProps = {
	meal?: Meal | null;
	onChange: (meal?: Meal | null) => any;
}

export default function MealSelect({meal, onChange}: MealSelectProps) {
	const storage = useGastroStorage();

	return <AutocompleteSelect
		selected={meal}
		onChange={onChange}
		onSearch={(text) => storage.meals.search(text)}
		labelGetter={(d) => d.name}
	/>

}
