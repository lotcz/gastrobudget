import {NavLink} from "react-router";

function MainMenu() {
	return (
		<div className="main-menu px-3">
			<div>
				<NavLink to="/">Domů</NavLink>
			</div>
			<div>
				<NavLink to="/events">Akce</NavLink>
			</div>
			<div>
				<NavLink to="/meals">Jídla</NavLink>
			</div>
			<div>
				<NavLink to="/ingredients">Ingredience</NavLink>
			</div>
		</div>
	);
}

export default MainMenu;
