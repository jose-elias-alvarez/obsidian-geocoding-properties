import { requestUrl } from "obsidian";
import { GeocodingResult, GoogleGeocodingAPIResponse } from "../types";

// https://developers.google.com/maps/documentation/geocoding/overview
export const fetchGoogleGeocodingResults = async (
	searchTerm: string,
	apiKey: string
): Promise<GeocodingResult[]> => {
	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchTerm}&key=${apiKey}`;
	const response = await requestUrl(url);
	if (response.status !== 200) {
		throw new Error(`Server responded with ${response.status}`);
	}

	const { status, results } = response.json as GoogleGeocodingAPIResponse;
	switch (status) {
		case "OK":
			break;
		case "ZERO_RESULTS":
			throw new Error("No results found");
		case "OVER_DAILY_LIMIT":
			throw new Error("Over daily limit");
		case "OVER_QUERY_LIMIT":
			throw new Error("Over query limit");
		case "REQUEST_DENIED":
			throw new Error("Request denied (invalid API key?)");
		default:
			throw new Error("Unknown API response");
	}

	return results.map((result) => ({
		address: result.formatted_address,
		lat: result.geometry.location.lat,
		lng: result.geometry.location.lng,
		info: result.types.join(", "),
		id: result.place_id,
		provider: "google-geocoding",
	}));
};
