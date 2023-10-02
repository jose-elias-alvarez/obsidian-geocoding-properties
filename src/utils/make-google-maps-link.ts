import { GeocodingResult } from "../types";

// https://developers.google.com/maps/documentation/urls/get-started
export const makeGoogleMapsLink = ({
	id,
	provider,
	lat,
	lng,
}: GeocodingResult) => {
	if (provider === "google-geocoding") {
		// if we got this from google, we can use place_id directly
		return `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${id}`;
	}
	const params = new URLSearchParams({
		api: "1",
		// we can only query by lat,lng or address, so we choose the more precise option
		query: `${lat},${lng}`,
	});
	return `https://www.google.com/maps/search/?${params.toString()}`;
};
