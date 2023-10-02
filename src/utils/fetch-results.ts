import { requestUrl } from "obsidian";
import { GeocodingAPIResponse } from "../types";

export const fetchResults = async (searchTerm: string, apiKey: string) => {
	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchTerm}&key=${apiKey}`;
	const response = await requestUrl(url);
	if (response.status !== 200) {
		throw new Error(`Server responded with ${response.status}`);
	}
	const { status, results } = response.json as GeocodingAPIResponse;
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
	return results;
};
