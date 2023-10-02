import { SuggestModal } from "obsidian";
import GeocodingPlugin from "./main";
import { GeocodingResult } from "./types";

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
			result.address.toLowerCase().includes(query.toLowerCase())
		);
	}

	onChooseSuggestion(result: GeocodingResult) {
		this.plugin.insertProperties(result);
	}

	renderSuggestion(
		{ address, lat, lng, info }: GeocodingResult,
		el: HTMLElement
	) {
		el.createEl("div", {
			text: `${address} (${lat}, ${lng})`,
		});
		if (info) {
			el.createEl("small", {
				text: info,
			});
		}
	}
}
