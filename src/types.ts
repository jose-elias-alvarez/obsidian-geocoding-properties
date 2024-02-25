export type GeocodingPropertyKey =
	| "address"
	| "lat"
	| "lng"
	| "location"
	| "map_link"
	| "map_view_link";
export type GeocodingProvider = "free-geocoding-api" | "google-geocoding";
export type MapLinkProvider = "google" | "apple" | "osm";

export interface GeocodingPropertyDescription {
	name: string;
	detail?: string;
}

export interface GeocodingProperty {
	frontmatterKey: string;
	enabled: boolean;
}

export interface GeocodingPluginSettings {
	properties: Record<GeocodingPropertyKey, GeocodingProperty>;
	overrideExistingProperties: boolean;
	mapLinkProvider: MapLinkProvider;
	apiProvider: GeocodingProvider;
	apiKey: string;
}

export interface GeocodingResult {
	address: string;
	lat: number;
	lng: number;
	info: string;
	id: string;
	provider: GeocodingProvider;
}

export interface GoogleGeocodingAPIResult {
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

export interface GoogleGeocodingAPIResponse {
	status:
		| "OK"
		| "ZERO_RESULTS"
		| "OVER_DAILY_LIMIT"
		| "OVER_QUERY_LIMIT"
		| "REQUEST_DENIED"
		| "INVALID_REQUEST"
		| "UNKNOWN_ERROR";
	results: GoogleGeocodingAPIResult[];
}

export interface FreeGeocodingAPIResult {
	osm_id: number;
	lat: string;
	lon: string;
	display_name: string;
	class: string;
	type: string;
}
