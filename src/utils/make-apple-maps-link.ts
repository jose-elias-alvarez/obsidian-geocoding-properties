import { GeocodingResult } from "../types";

// https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
export const makeAppleMapsLink = ({
	formatted_address,
	geometry: { location },
}: GeocodingResult) => {
	const params = new URLSearchParams({
		address: formatted_address,
		ll: `${location.lat},${location.lng}`,
	});
	return `https://maps.apple.com/?${params.toString()}`;
};
