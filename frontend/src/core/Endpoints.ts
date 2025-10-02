const BASE_URL =
	import.meta.env.NODE_ENV === "production"
		? import.meta.env.VITE_BASE_URL
		: import.meta.env.VITE_BASE_URL_DEV;

if (!BASE_URL) {
	throw new Error("Missing VITE_BASE_URL in .env");
}

// biome-ignore lint/complexity/noStaticOnlyClass: reason
export default class Endpoints {
	public static research = `${BASE_URL}/research`;
	public static reports = `${BASE_URL}/api/v1/reports`;
}
