import { Outlet } from "react-router";
import Footer from "@/components/Footer.tsx";
import Header from "@/components/Header.tsx";

export default function RootLayout() {
	return (
		<div className="min-h-screen flex flex-col justify-between">
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
}
