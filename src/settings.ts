import {
	GeocodingPluginSettings,
	GeocodingPropertyDescription,
	GeocodingPropertyKey,
} from "./types";

export const propertyDescriptions: Record<
	GeocodingPropertyKey,
	GeocodingPropertyDescription
> = {
	address: {
		name: "Address",
		detail: "Format varies by provider",
	},
	lat: {
		name: "Latitude",
	},
	lng: {
		name: "Longitude",
	},
	location: {
		name: "Location",
		detail: "Coordinates in [lat, lng] format",
	},
	map_link: {
		name: "Map link",
	},
	map_view_link: {
		name: "Map view link",
		detail: "A link in [](geo:lat,lng) format",
	},
};

export const defaultSettings: GeocodingPluginSettings = {
	properties: {
		address: {
			frontmatterKey: "address",
			enabled: true,
		},
		lat: {
			frontmatterKey: "lat",
			enabled: false,
		},
		lng: {
			frontmatterKey: "lng",
			enabled: false,
		},
		location: {
			frontmatterKey: "location",
			enabled: false,
		},
		map_link: {
			frontmatterKey: "map_link",
			enabled: false,
		},
		map_view_link: {
			frontmatterKey: "map_view_link",
			enabled: false,
		},
	},
	overrideExistingProperties: false,
	mapLinkProvider: "google",
	apiProvider: "free-geocoding-api",
	apiKey: "",
};
