const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!BASE_URL) {
	throw new Error("Missing VITE_BASE_URL in .env");
}

// biome-ignore lint/complexity/noStaticOnlyClass: reason
export default class Endpoints {
	public static research = `${BASE_URL}/research`;
}
