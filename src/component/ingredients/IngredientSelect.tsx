import {AutocompleteSelect} from "zavadil-react-common";
import {useGastroStorage} from "../../storage/GastroBudgetStorage";
import {Ingredient} from "../../types/Ingredient";

export type IngredientSelectProps = {
	ingredient?: Ingredient | null;
	onChange: (ingredient?: Ingredient | null) => any;
}

export default function IngredientSelect({ingredient, onChange}: IngredientSelectProps) {
	const storage = useGastroStorage();

	return <AutocompleteSelect
		selected={ingredient}
		onChange={onChange}
		onSearch={(text) => storage.ingredients.search(text)}
		labelGetter={(d) => d.name}
	/>

}
