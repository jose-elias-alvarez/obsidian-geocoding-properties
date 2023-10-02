import { App, PluginSettingTab, Setting } from "obsidian";
import GeocodingPlugin from "./main";
import { GeocodingPluginSettings } from "./types";

export const DEFAULT_SETTINGS: GeocodingPluginSettings = {
	apiProvider: "free-geocoding-api",
	apiKey: "",
	insertAddress: true,
	insertLocation: false,
	mapLinkProvider: "none",
};

export class GeocodingPluginSettingTab extends PluginSettingTab {
	plugin: GeocodingPlugin;

	constructor(app: App, plugin: GeocodingPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "API Settings" });
		new Setting(containerEl).setName("Provider").addDropdown((dropdown) =>
			dropdown
				.addOptions({
					["free-geocoding-api"]: "Free Geocoding API",
					["google-geocoding"]: "Google Geocoding",
				})
				.setValue(this.plugin.settings.apiProvider)
				.onChange(async (value) => {
					switch (value) {
						case "free-geocoding-api":
						case "google-geocoding":
							this.plugin.settings.apiProvider = value;
							break;
					}
					await this.plugin.saveSettings();
				})
		);
		new Setting(containerEl)
			.setName("API Key")
			.setDesc("Only required if using Google Geocoding")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h2", { text: "Properties" });
		new Setting(containerEl).setName("Address").addToggle((toggle) =>
			toggle
				.setValue(this.plugin.settings.insertAddress)
				.onChange(async (value) => {
					this.plugin.settings.insertAddress = value;
					await this.plugin.saveSettings();
				})
		);
		new Setting(containerEl)
			.setName("Location")
			.setDesc(
				"Latitude and longitude in an obsidian-leaflet-compatible format"
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.insertLocation)
					.onChange(async (value) => {
						this.plugin.settings.insertLocation = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Map link")
			.setDesc("A map link from the chosen provider")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						none: "None",
						google: "Google Maps",
						apple: "Apple Maps",
					})
					.setValue(this.plugin.settings.mapLinkProvider)
					.onChange(async (value) => {
						switch (value) {
							case "none":
							case "google":
							case "apple":
								this.plugin.settings.mapLinkProvider = value;
								break;
						}
						await this.plugin.saveSettings();
					})
			);
	}
}
