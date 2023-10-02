import { App, PluginSettingTab, Setting } from "obsidian";
import GeocodingPlugin from "./main";
import { GeocodingPluginSettings } from "./types";

export const DEFAULT_SETTINGS: GeocodingPluginSettings = {
	enabledProperties: {
		address: true,
		lat: true,
		lng: true,
		location: false,
		map_link: false,
	},
	overrideExistingProperties: false,
	mapLinkProvider: "google",
	apiProvider: "free-geocoding-api",
	apiKey: "",
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

		containerEl.createEl("h2", { text: "Enabled properties" });
		for (const property of Object.keys(
			this.plugin.settings.enabledProperties
		) as (keyof GeocodingPluginSettings["enabledProperties"])[]) {
			new Setting(containerEl).setName(property).addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enabledProperties[property])
					.onChange(async (value) => {
						this.plugin.settings.enabledProperties[property] =
							value;
						await this.plugin.saveSettings();
					})
			);
		}
		containerEl.createEl("h2", { text: "Property settings" });
		new Setting(containerEl)
			.setName("Override existing properties")
			.setDesc(
				"Whether to override existing properties with the same name"
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.overrideExistingProperties)
					.onChange(async (value) => {
						this.plugin.settings.overrideExistingProperties = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Map link provider")
			.setDesc("Provider for the map_link property, if enabled")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						google: "Google Maps",
						apple: "Apple Maps",
						osm: "OpenStreetMap",
					})
					.setValue(this.plugin.settings.mapLinkProvider)
					.onChange(async (value) => {
						switch (value) {
							case "google":
							case "apple":
							case "osm":
								this.plugin.settings.mapLinkProvider = value;
								break;
						}
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h2", { text: "API settings" });
		new Setting(containerEl)
			.setName("API provider")
			.addDropdown((dropdown) =>
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
			.setName("API key")
			.setDesc("Only required if using Google Geocoding")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
