import { GeocodingResult } from "../types";

// https://developers.google.com/maps/documentation/urls/get-started
export const makeGoogleMapsLink = ({ place_id }: GeocodingResult) =>
	`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${place_id}`;
