import { App, PluginSettingTab, Setting } from "obsidian";
import GeocodingPlugin from "./main";
import { propertyDescriptions } from "./settings";
import { GeocodingProperty, GeocodingPropertyKey } from "./types";

export class GeocodingPluginSettingTab extends PluginSettingTab {
	plugin: GeocodingPlugin;

	constructor(app: App, plugin: GeocodingPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Properties" });
		for (const [key, property] of Object.entries(
			this.plugin.settings.properties
		) as [GeocodingPropertyKey, GeocodingProperty][]) {
			new Setting(containerEl)
				.setName(propertyDescriptions[key].name || key)
				.setDesc(propertyDescriptions[key].detail || "")
				.addText((text) =>
					text
						.setValue(property.frontmatterKey)
						.onChange(async (value) => {
							property.frontmatterKey = value;
							await this.plugin.saveSettings();
						})
				)
				.addToggle((toggle) =>
					toggle
						.setValue(property.enabled)
						.onChange(async (value) => {
							property.enabled = value;
							await this.plugin.saveSettings();
						})
				);
		}
		containerEl.createEl("h2", { text: "Behavior" });
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

		containerEl.createEl("h2", { text: "API" });
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
			.setDisabled(
				this.plugin.settings.apiProvider !== "google-geocoding"
			)
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
