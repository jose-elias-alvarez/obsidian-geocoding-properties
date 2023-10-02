import { GeocodingResult } from "../types";

export const makeOsmLink = ({ id, provider, lat, lng }: GeocodingResult) => {
	if (provider === "free-geocoding-api") {
		// theoreticall we can use the osm_id from free-geocoding-api here,
		// but I can't find any relevant documentation
	}
	const params = new URLSearchParams({
		mlat: lat.toString(),
		mlon: lng.toString(),
	});
	return `https://openstreetmap.org/?${params.toString()}`;
};
