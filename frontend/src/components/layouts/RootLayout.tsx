import { Outlet } from "react-router";
import Footer from "@/components/layouts/Footer.tsx";
import Header from "@/components/layouts/Header.tsx";

export default function RootLayout() {
	return (
		<div className="min-h-screen flex flex-col justify-between">
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
}
