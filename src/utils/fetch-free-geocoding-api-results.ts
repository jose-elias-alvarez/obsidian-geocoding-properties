import { requestUrl } from "obsidian";
import { FreeGeocodingAPIResult, GeocodingResult } from "../types";

// https://geocode.maps.co
export const fetchFreeGeocodingAPIResults = async (
	searchTerm: string,
	apiKey: string
): Promise<GeocodingResult[]> => {
	const params = new URLSearchParams({
		q: searchTerm,
		api_key: apiKey,
	});
	const url = `https://geocode.maps.co/search?${params.toString()}`;
	const response = await requestUrl({
		url,
		throw: false,
	});
	const retryAfter = response.headers["Retry-After"];
	switch (response.status) {
		case 200:
			break;
		case 401:
			throw new Error("Unauthorized. Please check your API key.");
		case 409:
		case 503:
			if (retryAfter) {
				throw new Error(
					`Too many requests. Please try again in ${retryAfter} seconds.`
				);
			}
			throw new Error("Too many requests. Please try again later.");
		default:
			throw new Error(`Server responded with ${response.status}`);
	}

	const results = response.json as FreeGeocodingAPIResult[];
	return results.map((result) => ({
		address: result.display_name,
		lat: Number(result.lat),
		lng: Number(result.lon),
		info: `${result.class} ${result.type}`,
		id: result.osm_id.toString(),
		provider: "free-geocoding-api",
	}));
};
