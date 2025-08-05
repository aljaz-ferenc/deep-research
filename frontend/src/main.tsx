import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Provider from "./provider";
import App from "./App.tsx";

//biome-ignore lint/style/noNonNullAssertion: reason
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider>
			<App />
		</Provider>
	</StrictMode>,
);
