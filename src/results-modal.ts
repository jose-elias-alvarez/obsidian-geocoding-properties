import { SuggestModal } from "obsidian";
import GeocodingPlugin from "./main";

// subset of Google Maps Geocoding API response
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

export class GeocodingResultsModal extends SuggestModal<GeocodingResult> {
	plugin: GeocodingPlugin;
	results: GeocodingResult[];

	constructor(plugin: GeocodingPlugin, results: GeocodingResult[]) {
		super(plugin.app);
		this.plugin = plugin;
		this.results = results;
		this.setPlaceholder("Select result");
	}

	getSuggestions(query: string) {
		return this.results.filter((result) =>
			result.formatted_address.toLowerCase().includes(query.toLowerCase())
		);
	}

	onChooseSuggestion(result: GeocodingResult) {
		this.plugin.insertProperties(result);
	}

	renderSuggestion(
		{ formatted_address, types, geometry: { location } }: GeocodingResult,
		el: HTMLElement
	) {
		el.createEl("div", {
			text: `${formatted_address} (${location.lat}, ${location.lng})`,
		});
		if (types.length > 0) {
			el.createEl("small", {
				text: types.join(", "),
			});
		}
	}
}
