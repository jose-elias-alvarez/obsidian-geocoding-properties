export interface GeocodingResult {
	formatted_address: string;
	geometry: {
		location: {
			lat: number;
			lng: number;
		};
	};
	types: string[];
	place_id: string;
}

export interface GeocodingAPIResponse {
	status:
		| "OK"
		| "ZERO_RESULTS"
		| "OVER_DAILY_LIMIT"
		| "OVER_QUERY_LIMIT"
		| "REQUEST_DENIED"
		| "INVALID_REQUEST"
		| "UNKNOWN_ERROR";
	results: GeocodingResult[];
}
