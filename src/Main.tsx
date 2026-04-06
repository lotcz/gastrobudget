import {Route, Routes} from "react-router";
import IngredientsPage from "./component/ingredients/IngredientsPage";
import NotFoundPage from "./component/NotFoundPage";
import MealsPage from "./component/meals/MealsPage";
import MealPage from "./component/meals/MealPage";
import EventsPage from "./component/events/EventsPage";
import EventPage from "./component/events/EventPage";

export default function Main() {
	return (
		<Routes>
			<Route path="ingredients" element={<IngredientsPage/>}/>
			<Route path="meals">
				<Route path="" element={<MealsPage/>}/>
				<Route path="add" element={<MealPage/>}/>
				<Route path=":id" element={<MealPage/>}/>
			</Route>
			<Route path="events">
				<Route path="" element={<EventsPage/>}/>
				<Route path="add" element={<EventPage/>}/>
				<Route path=":id" element={<EventPage/>}/>
			</Route>
			<Route path="*" element={<NotFoundPage/>}/>
		</Routes>
	);
}
