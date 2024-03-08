import { Notice, Plugin, TFile } from "obsidian";
import { GeocodingSearchModal } from "./search-modal";
import { defaultSettings } from "./settings";
import { GeocodingPluginSettingTab } from "./settings-tab";
import {
	GeocodingPluginSettings,
	GeocodingProperty,
	GeocodingPropertyKey,
	GeocodingResult,
} from "./types";
import { fetchFreeGeocodingAPIResults } from "./utils/fetch-free-geocoding-api-results";
import { fetchGoogleGeocodingResults } from "./utils/fetch-google-geocoding-results";
import { makeAppleMapsLink } from "./utils/make-apple-maps-link";
import { makeGoogleMapsLink } from "./utils/make-google-maps-link";
import { makeOsmLink } from "./utils/make-osm-link";

export default class GeocodingPlugin extends Plugin {
	settings: GeocodingPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new GeocodingPluginSettingTab(this.app, this));

		this.addCommand({
			id: "insert-into-current-note",
			name: "Insert properties into current note",
			editorCallback: async (_, ctx) => {
				const currentFile = ctx.file;
				if (!currentFile) {
					return;
				}
				const searchTerm = this.getSearchTerm(currentFile);
				new GeocodingSearchModal(this, searchTerm).open();
			},
		});
		this.addCommand({
			id: "insert-into-current-note-no-confirmation",
			name: "Insert properties into current note (no confirmation)",
			editorCallback: async (_, ctx) => {
				const currentFile = ctx.file;
				if (!currentFile) {
					return;
				}
				const searchTerm = this.getSearchTerm(currentFile);
				const results = await this.getResults(searchTerm);
				await this.insertProperties(results[0]);
			},
		});
	}

	getSearchTerm(file: TFile) {
		let searchTerm = file.basename;
		const metadataCache = this.app.metadataCache.getFileCache(file);
		if (metadataCache?.frontmatter) {
			searchTerm =
				metadataCache.frontmatter.address ||
				metadataCache.frontmatter.title ||
				searchTerm;
		}
		return searchTerm;
	}

	async getResults(searchTerm: string) {
		const results: GeocodingResult[] = [];
		try {
			const { apiProvider, apiKey } = this.settings;
			switch (apiProvider) {
				case "free-geocoding-api":
					results.push(
						...(await fetchFreeGeocodingAPIResults(searchTerm))
					);
					break;
				case "google-geocoding":
					results.push(
						...(await fetchGoogleGeocodingResults(
							searchTerm,
							apiKey
						))
					);
					break;
				default:
					throw new Error(`Invalid API provider: ${apiProvider}`);
			}
		} catch (error) {
			new Notice(String(error));
			// log to console
			throw error;
		}
		if (!results?.length) {
			new Notice(`No results found for "${searchTerm}"`);
		}
		return results;
	}

	async insertProperties(result: GeocodingResult) {
		const currentFile = this.app.workspace.getActiveFile();
		if (!currentFile) {
			return;
		}
		const { overrideExistingProperties, mapLinkProvider, properties } =
			this.settings;
		this.app.fileManager.processFrontMatter(currentFile, (frontmatter) => {
			for (const [key, property] of Object.entries(properties) as [
				GeocodingPropertyKey,
				GeocodingProperty
			][]) {
				const shouldInsert =
					property.enabled &&
					(overrideExistingProperties ||
						frontmatter[property.frontmatterKey] === undefined);
				if (!shouldInsert) {
					continue;
				}
				switch (key) {
					case "location":
						frontmatter[property.frontmatterKey] = [
							result.lat.toString(),
							result.lng.toString(),
						];
						break;
					case "map_link":
						switch (mapLinkProvider) {
							case "google":
								frontmatter[property.frontmatterKey] =
									makeGoogleMapsLink(result);
								break;
							case "apple":
								frontmatter[property.frontmatterKey] =
									makeAppleMapsLink(result);
								break;
							case "osm":
								frontmatter[property.frontmatterKey] =
									makeOsmLink(result);
								break;
						}
						break;
					case "map_view_link": {
						frontmatter[
							property.frontmatterKey
						] = `[](geo:${result.lat},${result.lng})`;
						break;
					}
					default:
						frontmatter[property.frontmatterKey] = result[key];
						break;
				}
			}
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			defaultSettings,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
