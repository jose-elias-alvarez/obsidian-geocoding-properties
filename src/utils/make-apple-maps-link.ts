import { GeocodingResult } from "../types";

// https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
export const makeAppleMapsLink = ({ address, lat, lng }: GeocodingResult) => {
	const params = new URLSearchParams({
		ll: `${lat},${lng}`,
		address, // used only for display
	});
	return `https://maps.apple.com/?${params.toString()}`;
};
