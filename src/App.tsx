import {BrowserRouter} from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.less";
import Main from "./Main";
import {Stack} from "react-bootstrap";
import MainMenu from "./MainMenu";

export default function App() {
	return (
		<BrowserRouter>
			<div>
				<header>
					<h1>GastroBudget</h1>
				</header>
				<Stack direction="horizontal" className="gap-2 align-items-start">
					<MainMenu/>
					<Main/>
				</Stack>
				<footer>GastroBudget v. 1.1</footer>
			</div>
		</BrowserRouter>
	);
}
