import { Notice, Plugin } from "obsidian";
import { GeocodingResultsModal } from "./results-modal";
import { GeocodingSearchModal } from "./search-modal";
import { DEFAULT_SETTINGS, GeocodingPluginSettingTab } from "./settings";
import { GeocodingPluginSettings, GeocodingResult } from "./types";
import { fetchFreeGeocodingAPIResults } from "./utils/fetch-free-geocoding-api-results";
import { fetchGoogleGeocodingResults } from "./utils/fetch-google-geocoding-results";
import { makeAppleMapsLink } from "./utils/make-apple-maps-link";
import { makeGoogleMapsLink } from "./utils/make-google-maps-link";

export default class GeocodingPlugin extends Plugin {
	settings: GeocodingPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new GeocodingPluginSettingTab(this.app, this));

		this.addCommand({
			id: "geocoding-properties-insert",
			name: "Insert properties into current note",
			callback: this.displaySearchModal.bind(this),
		});
	}

	async displaySearchModal() {
		const currentFile = this.app.workspace.getActiveFile();
		if (!currentFile) {
			return;
		}
		let searchTerm = currentFile.basename;
		const metadataCache = this.app.metadataCache.getFileCache(currentFile);
		if (metadataCache?.frontmatter) {
			searchTerm =
				metadataCache.frontmatter.address ||
				metadataCache.frontmatter.title ||
				searchTerm;
		}

		new GeocodingSearchModal(this, searchTerm).open();
	}

	async getAndDisplayResults(searchTerm: string) {
		try {
			const { apiProvider, apiKey } = this.settings;
			let results: GeocodingResult[] | undefined;
			switch (apiProvider) {
				case "free-geocoding-api":
					results = await fetchFreeGeocodingAPIResults(searchTerm);
					break;
				case "google-geocoding":
					results = await fetchGoogleGeocodingResults(
						searchTerm,
						apiKey
					);
					break;
			}
			if (!results) {
				return;
			}
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
		const {
			overrideExistingProperties,
			mapLinkProvider,
			enabledProperties,
		} = this.settings;
		this.app.fileManager.processFrontMatter(currentFile, (frontmatter) => {
			for (const property of Object.keys(
				enabledProperties
			) as (keyof typeof enabledProperties)[]) {
				const shouldInsert =
					enabledProperties[property] &&
					(overrideExistingProperties ||
						frontmatter[property] === undefined);
				if (!shouldInsert) {
					continue;
				}
				switch (property) {
					case "address":
						frontmatter.address = result.address;
						break;
					case "location":
						frontmatter.location = [result.lat, result.lng];
						break;
					case "map_link":
						switch (mapLinkProvider) {
							case "apple":
								frontmatter.map_link =
									makeAppleMapsLink(result);
								break;
							case "google":
								frontmatter.map_link =
									makeGoogleMapsLink(result);
								break;
						}
						break;
				}
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
