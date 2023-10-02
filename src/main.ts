import { Notice, Plugin } from "obsidian";
import { GeocodingResultsModal } from "./results-modal";
import { GeocodingSearchModal } from "./search-modal";
import {
	DEFAULT_SETTINGS,
	GeocodingPluginSettingTab,
	GeocodingPluginSettings,
} from "./settings";
import { GeocodingResult } from "./types";
import { fetchResults } from "./utils/fetch-results";
import { makeAppleMapsLink } from "./utils/make-apple-maps-link";
import { makeGoogleMapsLink } from "./utils/make-google-maps-link";

export default class GeocodingPlugin extends Plugin {
	settings: GeocodingPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new GeocodingPluginSettingTab(this.app, this));

		this.addCommand({
			id: "geocoding-insert-properties",
			name: "Insert properties for current note",
			callback: async () => {
				const currentFile = this.app.workspace.getActiveFile();
				if (!currentFile) {
					return;
				}
				new GeocodingSearchModal(this, currentFile.basename).open();
			},
		});
	}

	async getAndDisplayResults(searchTerm: string) {
		try {
			const { apiKey } = this.settings;
			if (!apiKey) {
				throw new Error("No API key set");
			}
			const results = await fetchResults(searchTerm, apiKey);
			new GeocodingResultsModal(this, results).open();
		} catch (error) {
			new Notice(String(error));
		}
	}

	async insertProperties(result: GeocodingResult) {
		const currentFile = this.app.workspace.getActiveFile();
		if (!currentFile) {
			return;
		}
		const { insertAddress, insertLocation, mapLinkProvider } =
			this.settings;
		this.app.fileManager.processFrontMatter(currentFile, (frontmatter) => {
			if (insertAddress) {
				frontmatter.address = result.formatted_address;
			}
			if (insertLocation) {
				frontmatter.location = [
					result.geometry.location.lat,
					result.geometry.location.lng,
				];
			}
			switch (mapLinkProvider) {
				case "google":
					frontmatter.map_link = makeGoogleMapsLink(result);
					break;
				case "apple":
					frontmatter.map_link = makeAppleMapsLink(result);
					break;
			}
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
