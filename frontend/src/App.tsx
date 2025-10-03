import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "@/components/layouts/RootLayout.tsx";
import HomeRoute from "@/components/routes/home/HomeRoute.tsx";
import NotFoundRoute from "@/components/routes/NotFoundRoute.tsx";
import ReportsRoute from "@/components/routes/reports/ReportsRoute.tsx";
import SingleReportRoute from "@/components/routes/single-report/SingleReportRoute.tsx";
import Provider from "@/provider";

const router = createBrowserRouter([
	{
		path: "/",
		Component: RootLayout,
		children: [
			{ index: true, Component: HomeRoute },
			{
				path: "reports",
				Component: ReportsRoute,
			},
			{ path: "reports/:reportId", Component: SingleReportRoute },
		],
	},
	{ path: "*", Component: NotFoundRoute },
]);

function App() {
	return (
		<Provider>
			<RouterProvider router={router} />
		</Provider>
	);
}

export default App;
